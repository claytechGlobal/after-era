import { ProductGrid } from "@/components/ProductCard";
import { categoryLabel } from "@/lib/categories";
import { filterByCategory, getProducts } from "@/lib/products";
import Link from "next/link";

const chips = [
  { href: "/shop", id: "all" },
  { href: "/shop/tops", id: "tops" },
  { href: "/shop/accessories", id: "accessories" },
  { href: "/shop/bottoms", id: "bottoms" },
  { href: "/shop/coordinate", id: "coordinate" }
];

export default async function ShopPage({ params }: { params: Promise<{ category?: string[] }> }) {
  const { category } = await params;
  const cat = category?.[0] || "all";
  const products = filterByCategory(await getProducts(), cat);
  return (
    <div className="max-w-7xl mx-auto px-5 pt-14 pb-24">
      <p className="text-[10px] tracking-[0.32em] uppercase text-gold-deep font-head font-semibold mb-3">Collection</p>
      <h1 className="font-display font-semibold text-5xl mb-3">{categoryLabel(cat)}</h1>
      <p className="text-sm text-ink/50 mb-8">{products.length} piece{products.length === 1 ? "" : "s"}</p>
      <div className="flex flex-wrap gap-2 mb-12">
        {chips.map((c) => (
          <Link
            key={c.id}
            href={c.href}
            className={`px-4 py-2 text-[10px] font-head tracking-tr1 uppercase border ${cat === c.id ? "bg-ink text-paper border-ink" : "border-line hover:border-ink"}`}
          >
            {categoryLabel(c.id)}
          </Link>
        ))}
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
