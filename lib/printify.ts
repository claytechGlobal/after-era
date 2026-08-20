import { categorizeProduct } from "./categories";
import type { StoreProduct } from "./types";

const PRINTIFY_API = "https://api.printify.com/v1";

let lastError = "";
let lastShops: { id: string; title: string }[] = [];

function token() {
  return (process.env.PRINTIFY_API_TOKEN || "").replace(/\s+/g, "").replace(/^["']+|["']+$/g, "");
}

function shopIdEnv() {
  return (process.env.PRINTIFY_SHOP_ID || "").replace(/\s+/g, "").replace(/^["']+|["']+$/g, "");
}

export function printifyConfigured() {
  return token().length > 0;
}

export function printifyDebug() {
  return { configured: printifyConfigured(), tokenLength: token().length, lastError, shops: lastShops };
}

async function printifyFetch(path: string) {
  const t = token();
  if (!t) {
    lastError = "NO_TOKEN";
    return null;
  }
  const res = await fetch(`${PRINTIFY_API}${path}`, {
    headers: {
      Authorization: `Bearer ${t}`,
      "User-Agent": "AfterEraStore/1.0 (after-era.com)"
    },
    cache: "no-store",
    signal: AbortSignal.timeout(8000)
  });
  if (!res.ok) {
    lastError = `HTTP_${res.status}`;
    return null;
  }
  return res.json();
}

function asShops(raw: unknown) {
  if (Array.isArray(raw)) return raw as { id: number | string; title?: string }[];
  if (raw && typeof raw === "object" && Array.isArray((raw as { data?: unknown }).data)) {
    return (raw as { data: { id: number | string; title?: string }[] }).data;
  }
  return [];
}

type PrintifyVariant = {
  id: number;
  title: string;
  sku: string;
  price: number;
  is_enabled: boolean;
  is_available: boolean;
  options: number[] | Record<string, string>;
};

type PrintifyProduct = {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  created_at?: string;
  visible?: boolean;
  images?: { src: string; is_default?: boolean; variant_ids?: number[] }[];
  options?: { name: string; type?: string; values: { id: number; title: string }[] }[];
  variants?: PrintifyVariant[];
};

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function mapProduct(p: PrintifyProduct): StoreProduct {
  const options = (p.options || []).map((opt) => ({
    name: opt.name,
    values: Array.from(new Set((opt.values || []).map((v) => v.title)))
  }));
  const valueMap: Record<string, { name: string; title: string }> = {};
  (p.options || []).forEach((opt) => {
    (opt.values || []).forEach((val) => {
      valueMap[String(val.id)] = { name: opt.name, title: val.title };
    });
  });
  const enabled = (p.variants || []).filter((v) => v.is_enabled);
  const source = enabled.length ? enabled : p.variants || [];
  const variants = source.map((v) => {
    const mapped: Record<string, string> = {};
    if (Array.isArray(v.options)) {
      v.options.forEach((optId) => {
        const found = valueMap[String(optId)];
        if (found) mapped[found.name] = found.title;
      });
    } else if (v.options && typeof v.options === "object") {
      Object.entries(v.options).forEach(([key, val]) => {
        const opt = options.find(
          (o) =>
            o.name.toLowerCase() === key.toLowerCase() ||
            o.name.toLowerCase().replace(/s$/, "") === key.toLowerCase().replace(/s$/, "")
        );
        mapped[opt?.name || key] = String(val);
      });
    }
    if (v.title) {
      const parts = v.title.split("/").map((part) => part.trim());
      options.forEach((opt, i) => {
        if (mapped[opt.name]) return;
        const part = parts[i] || "";
        const match =
          opt.values.find((val) => val.toLowerCase() === part.toLowerCase()) ||
          opt.values.find((val) => part.toLowerCase() === val.toLowerCase());
        if (match) mapped[opt.name] = match;
      });
    }
    return {
      id: String(v.id),
      title: v.title,
      sku: v.sku || "",
      price: v.price,
      available: v.is_available !== false,
      options: mapped
    };
  });
  const prices = variants.map((v) => v.price).filter((n) => n > 0);
  const images = (p.images || [])
    .map((img) => ({
      src: img.src,
      alt: p.title,
      variantIds: (img.variant_ids || []).map(String)
    }))
    .filter((img) => img.src);
  if (images.length === 0) {
    images.push({ src: "/hoodie.png", alt: p.title, variantIds: [] });
  }
  return {
    id: p.id,
    title: p.title,
    description: stripHtml(p.description || ""),
    category: categorizeProduct(p.title, p.tags || []),
    price: prices.length ? Math.min(...prices) : 0,
    images,
    options,
    variants,
    tags: p.tags || [],
    createdAt: p.created_at,
    shopId: ""
  };
}

async function productsForShop(id: string) {
  const data = await printifyFetch(`/shops/${id}/products.json?limit=50`);
  if (!data) return [];
  if (Array.isArray(data)) return data as PrintifyProduct[];
  return (data.data || []) as PrintifyProduct[];
}

async function listShops() {
  const raw = await printifyFetch("/shops.json");
  const shops = asShops(raw);
  lastShops = shops.map((s) => ({ id: String(s.id), title: s.title || "" }));
  return shops;
}

export async function getShopId(): Promise<string | null> {
  if (shopIdEnv()) return shopIdEnv();
  const shops = await listShops();
  if (!shops.length) {
    lastError = lastError || "NO_SHOPS";
    return null;
  }
  const named = shops.find((s) => String(s.title || "").toLowerCase().includes("after"));
  return String((named || shops[0]).id);
}

export async function fetchPrintifyProducts(): Promise<StoreProduct[] | null> {
  if (!token()) return null;
  const shops = await listShops();
  const ids = shopIdEnv() ? [shopIdEnv()] : shops.map((s) => String(s.id));
  const lists = await Promise.all(ids.map((id) => productsForShop(id)));
  const seen = new Set<string>();
  const mapped: StoreProduct[] = [];
  lists.forEach((list, i) => {
    list.forEach((p) => {
      if (!p?.id || seen.has(p.id)) return;
      seen.add(p.id);
      const product = mapProduct(p);
      product.shopId = ids[i];
      mapped.push(product);
    });
  });
  if (mapped.length) lastError = "";
  if (!mapped.length && shopIdEnv() && shops.length) {
    const extra = await Promise.all(shops.map((s) => productsForShop(String(s.id))));
    extra.forEach((list, i) => {
      list.forEach((p) => {
        if (!p?.id || seen.has(p.id)) return;
        seen.add(p.id);
        const product = mapProduct(p);
        product.shopId = String(shops[i].id);
        mapped.push(product);
      });
    });
    if (mapped.length) lastError = "";
  }
  return mapped;
}

export async function fetchPrintifyProduct(id: string): Promise<StoreProduct | null> {
  if (!token()) return null;
  const shops = await listShops();
  const ids = shopIdEnv() ? [shopIdEnv(), ...shops.map((s) => String(s.id))] : shops.map((s) => String(s.id));
  for (const shop of ids) {
    const data = await printifyFetch(`/shops/${shop}/products/${id}.json`);
    if (data?.id) {
      const product = mapProduct(data as PrintifyProduct);
      product.shopId = String(shop);
      return product;
    }
  }
  return null;
}

export async function allShopIds() {
  const shops = await listShops();
  const forced = shopIdEnv();
  return forced ? [forced, ...shops.map((s) => String(s.id))] : shops.map((s) => String(s.id));
}
