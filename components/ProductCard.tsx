import Link from "next/link";
import { formatPrice, shortTitle } from "@/lib/products";
import type { StoreProduct } from "@/lib/types";

function ProductImage({ src, className }: { src: string; className?: string }) {
  return <img src={src || "/hoodie.png"} alt="" className={className} />;
}

export function ProductCard({ product }: { product: StoreProduct }) {
  const img = product.images[0]?.src || "/hoodie.png";
  const hover = product.images[1]?.src;
  return (
    <Link href={`/product/${product.id}`} className="card group block">
      <div className="relative overflow-hidden bg-stone aspect-[3/4]">
        <ProductImage src={img} className={`prod-img absolute inset-0 w-full h-full object-contain p-4 ${hover ? "group-hover:opacity-0" : ""} transition-opacity duration-500`} />
        {hover ? (
          <ProductImage src={hover} className="absolute inset-0 w-full h-full object-contain p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        ) : null}
        <span className="absolute inset-x-0 bottom-0 py-3 text-center text-[10px] font-head tracking-tr1 uppercase text-paper bg-ink/0 group-hover:bg-ink/80 opacity-0 group-hover:opacity-100 transition-all">
          View piece
        </span>
      </div>
      <div className="pt-4">
        <p className="font-head font-semibold text-[13px] leading-snug">{shortTitle(product.title)}</p>
        <p className="text-[13px] text-ink/55 mt-1">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: StoreProduct[] }) {
  if (!products.length) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-3xl mb-2">Coming soon</p>
        <p className="text-sm text-ink/50">This collection is being prepared.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-8">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
