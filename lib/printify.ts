import { categorizeProduct } from "./categories";
import type { StoreProduct } from "./types";

const PRINTIFY_API = "https://api.printify.com/v1";

function token() {
  return process.env.PRINTIFY_API_TOKEN || "";
}

async function printifyFetch(path: string) {
  const t = token();
  if (!t) return null;
  const res = await fetch(`${PRINTIFY_API}${path}`, {
    headers: {
      Authorization: `Bearer ${t}`,
      "User-Agent": "AfterEraStore/1.0"
    },
    cache: "no-store",
    signal: AbortSignal.timeout(30000)
  });
  if (!res.ok) {
    throw new Error(`Printify ${res.status}`);
  }
  return res.json();
}

export function printifyConfigured() {
  return Boolean(token());
}

export async function getShopId(): Promise<string | null> {
  if (process.env.PRINTIFY_SHOP_ID) return process.env.PRINTIFY_SHOP_ID;
  const shops = await printifyFetch("/shops.json");
  if (!Array.isArray(shops) || shops.length === 0) return null;
  const named = shops.find((s: { title?: string }) =>
    String(s.title || "").toLowerCase().includes("after")
  );
  return String((named || shops[0]).id);
}

type PrintifyVariant = {
  id: number;
  title: string;
  sku: string;
  price: number;
  is_enabled: boolean;
  is_available: boolean;
  options: number[];
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
    values: (opt.values || []).map((v) => v.title)
  }));
  const optionIndex = (p.options || []).map((opt) =>
    Object.fromEntries((opt.values || []).map((v) => [v.id, { name: opt.name, title: v.title }]))
  );
  const variants = (p.variants || [])
    .filter((v) => v.is_enabled)
    .map((v) => {
      const mapped: Record<string, string> = {};
      (v.options || []).forEach((optId, i) => {
        const found = optionIndex[i]?.[optId];
        if (found) mapped[found.name] = found.title;
      });
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
    .map((img) => ({ src: img.src, alt: p.title }))
    .filter((img) => img.src);
  if (images.length === 0) {
    images.push({ src: "/hoodie.png", alt: p.title });
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
    createdAt: p.created_at
  };
}

export async function fetchPrintifyProducts(): Promise<StoreProduct[] | null> {
  if (!token()) return null;
  const shopId = await getShopId();
  if (!shopId) return null;
  const all: PrintifyProduct[] = [];
  let page = 1;
  while (page <= 10) {
    const data = await printifyFetch(`/shops/${shopId}/products.json?limit=50&page=${page}`);
    const list: PrintifyProduct[] = data?.data || [];
    all.push(...list);
    if (list.length < 50) break;
    page += 1;
  }
  return all.filter((p) => p.visible !== false).map(mapProduct);
}

export async function fetchPrintifyProduct(id: string): Promise<StoreProduct | null> {
  if (!token()) return null;
  const shopId = await getShopId();
  if (!shopId) return null;
  const data = await printifyFetch(`/shops/${shopId}/products/${id}.json`);
  if (!data?.id) return null;
  return mapProduct(data as PrintifyProduct);
}
