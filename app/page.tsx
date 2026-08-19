import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import Link from "next/link";

export default async function HomePage() {
  const products = await getProducts();
  const apparel = products.filter((p) => p.category === "tops");
  const extras = products.filter((p) => p.category === "accessories");
  const featured = apparel[0] || products[0];
  const look = products.slice(0, 6);

  return (
    <>
      <Hero />
      <div className="bg-ink text-gold overflow-hidden border-y border-white/5 py-3">
        <div className="marquee">
          <div className="marquee-track font-head text-[11px] tracking-[0.35em] uppercase">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i}>Wear your rise · Every wing was once ash ·</span>
            ))}
          </div>
        </div>
      </div>
      {featured ? (
        <section className="max-w-7xl mx-auto px-5 py-24 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="bg-stone aspect-[4/5] overflow-hidden">
            <img src={featured.images[0]?.src || "/hoodie.png"} alt="" className="w-full h-full object-contain p-8" />
          </div>
          <div>
            <p className="text-[10px] tracking-[0.32em] uppercase text-gold-deep font-head font-semibold mb-5">Signature</p>
            <h2 className="font-display font-semibold text-4xl sm:text-5xl leading-[1.05] mb-5">The crest, worn forward.</h2>
            <p className="text-ink/65 max-w-md leading-relaxed mb-8">
              Gold monogram pieces from the A.F.T.E.R. ERA archive — printed to order, never sitting in a warehouse.
            </p>
            <Link href={`/product/${featured.id}`} className="btn btn-primary">Shop this piece</Link>
          </div>
        </section>
      ) : null}
      <section className="px-5 pb-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-4">
          <Link href="/shop/tops" className="relative min-h-[380px] overflow-hidden group bg-ink text-paper">
            <img src={apparel[0]?.images[0]?.src || "/hoodie.png"} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" />
            <div className="relative h-full min-h-[380px] flex flex-col justify-end p-8">
              <p className="text-[10px] tracking-[0.28em] uppercase text-gold mb-2">Apparel</p>
              <h3 className="font-display text-4xl">Tops</h3>
            </div>
          </Link>
          <Link href="/shop/accessories" className="relative min-h-[380px] overflow-hidden group bg-ink text-paper">
            <img src={extras[0]?.images[0]?.src || "/logo.png"} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" />
            <div className="relative h-full min-h-[380px] flex flex-col justify-end p-8">
              <p className="text-[10px] tracking-[0.28em] uppercase text-gold mb-2">Objects</p>
              <h3 className="font-display text-4xl">Accessories</h3>
            </div>
          </Link>
        </div>
      </section>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] tracking-[0.32em] uppercase text-gold-deep font-head font-semibold mb-2">The edit</p>
              <h2 className="font-display font-semibold text-4xl">New from the shop</h2>
            </div>
            <Link href="/shop" className="hidden sm:inline text-[11px] font-head font-semibold tracking-tr1 uppercase border-b border-ink pb-1">
              View all
            </Link>
          </div>
          <ProductGrid products={look} />
        </div>
      </section>
      <section className="bg-ink text-paper">
        <div className="max-w-7xl mx-auto px-5 py-20 grid md:grid-cols-3 gap-12 text-center md:text-left">
          <div>
            <p className="font-display text-3xl text-gold mb-3">Rise up</p>
            <p className="text-paper/60 text-sm leading-relaxed">Designed for the after, worn forward.</p>
          </div>
          <div>
            <p className="font-display text-3xl text-gold mb-3">Stay soft</p>
            <p className="text-paper/60 text-sm leading-relaxed">Comfort you can live in on the hard days and the good ones.</p>
          </div>
          <div>
            <p className="font-display text-3xl text-gold mb-3">Made to order</p>
            <p className="text-paper/60 text-sm leading-relaxed">Printed just for you. Free shipping over $75.</p>
          </div>
        </div>
      </section>
    </>
  );
}
