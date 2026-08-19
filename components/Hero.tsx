import Link from "next/link";

export function Hero() {
  return (
    <section className="relative bg-ink text-paper overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 min-h-[86vh]">
        <div className="flex flex-col justify-center px-6 sm:px-10 py-20 lg:py-0 relative z-10">
          <p className="text-[10px] tracking-[0.32em] uppercase text-gold font-head font-semibold mb-6">Est. collection</p>
          <h1 className="font-display font-semibold text-6xl sm:text-7xl lg:text-8xl leading-[0.88] mb-7">
            Wear<br />your rise.
          </h1>
          <p className="max-w-md text-paper/70 text-base leading-relaxed mb-10">
            Crowned phoenix pieces, made to order. Soft layers for the chapter after the fire.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-primary bg-paper text-ink hover:bg-gold hover:text-ink">
              Shop collection
            </Link>
            <Link href="/about" className="btn btn-line text-paper">
              The story
            </Link>
          </div>
        </div>
        <div className="relative min-h-[52vh] lg:min-h-full">
          <img src="/hero.gif" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-transparent lg:to-ink/40" />
        </div>
      </div>
    </section>
  );
}
