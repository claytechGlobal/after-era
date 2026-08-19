import { fetchPrintifyProduct, fetchPrintifyProducts } from "./printify";
import type { ProductCategory, StoreProduct } from "./types";

const fallback: StoreProduct[] = [
  {
    id: "phoenix-hoodie",
    title: "Phoenix Hoodie",
    description: "Our signature crest, printed in metallic gold on soft sand fleece. The piece that started it all.",
    category: "tops",
    price: 5800,
    images: [
      { src: "/hoodie.png", alt: "Phoenix Hoodie" },
      { src: "/hero.gif", alt: "Phoenix Hoodie detail" }
    ],
    options: [
      { name: "Size", values: ["S", "M", "L", "XL", "2XL"] },
      { name: "Color", values: ["Sand"] }
    ],
    variants: [
      { id: "hoodie-s", title: "Sand / S", sku: "AE-HOOD-S", price: 5800, available: true, options: { Size: "S", Color: "Sand" } },
      { id: "hoodie-m", title: "Sand / M", sku: "AE-HOOD-M", price: 5800, available: true, options: { Size: "M", Color: "Sand" } },
      { id: "hoodie-l", title: "Sand / L", sku: "AE-HOOD-L", price: 5800, available: true, options: { Size: "L", Color: "Sand" } },
      { id: "hoodie-xl", title: "Sand / XL", sku: "AE-HOOD-XL", price: 5800, available: true, options: { Size: "XL", Color: "Sand" } },
      { id: "hoodie-2xl", title: "Sand / 2XL", sku: "AE-HOOD-2XL", price: 5800, available: true, options: { Size: "2XL", Color: "Sand" } }
    ],
    tags: ["hoodie", "best-seller"]
  },
  {
    id: "phoenix-crest-tee",
    title: "Phoenix Crest Tee",
    description: "Everyday graphic tee with the crowned phoenix crest. Clean design, easy fit, made to wear on repeat.",
    category: "tops",
    price: 3200,
    images: [{ src: "/hoodie.png", alt: "Phoenix Crest Tee" }],
    options: [{ name: "Size", values: ["S", "M", "L", "XL"] }],
    variants: ["S", "M", "L", "XL"].map((s) => ({
      id: `tee-${s.toLowerCase()}`,
      title: s,
      sku: `AE-TEE-${s}`,
      price: 3200,
      available: true,
      options: { Size: s }
    })),
    tags: ["tee"]
  },
  {
    id: "phoenix-keychain",
    title: "Phoenix Crown Keychain Charm",
    description: "Original A.F.T.E.R ERA Phoenix Crown Keychain Charm — double-sided rectangular keyring.",
    category: "accessories",
    price: 1800,
    images: [{ src: "/logo.png", alt: "Phoenix Crown Keychain" }],
    options: [{ name: "Style", values: ["Double-sided"] }],
    variants: [
      {
        id: "keychain-default",
        title: "Double-sided",
        sku: "AE-KEY-01",
        price: 1800,
        available: true,
        options: { Style: "Double-sided" }
      }
    ],
    tags: ["keychain"]
  }
];

export async function getProducts(): Promise<StoreProduct[]> {
  if (process.env.PRINTIFY_API_TOKEN) {
    try {
      const live = await fetchPrintifyProducts();
      return live || [];
    } catch {
      return [];
    }
  }
  return fallback;
}

export async function getProduct(id: string): Promise<StoreProduct | null> {
  if (process.env.PRINTIFY_API_TOKEN) {
    try {
      const live = await fetchPrintifyProduct(id);
      if (live) return live;
    } catch {}
    const products = await getProducts();
    return products.find((p) => p.id === id) || null;
  }
  return fallback.find((p) => p.id === id) || null;
}

export function filterByCategory(products: StoreProduct[], category?: string) {
  if (!category || category === "all" || category === "shop") return products;
  if (category === "new") {
    return [...products].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  }
  if (category === "best") return products.slice(0, 8);
  return products.filter((p) => p.category === (category as ProductCategory));
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export function displayTitle(title: string) {
  const cleaned = title
    .replace(/Original\s+/gi, "")
    .replace(/A\.F\.T\.E\.R\.?\s*ERA\s*/gi, "")
    .replace(/^[-—–:\s]+/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  return cleaned || title;
}

export function shortTitle(title: string) {
  const t = displayTitle(title);
  return t.split(/[—–]/)[0].trim();
}
