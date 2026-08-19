import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <div className="bg-ink text-paper">
        <div className="max-w-4xl mx-auto px-5 py-24 md:py-32 text-center">
          <img src="/logo.png" alt="" className="mx-auto h-24 w-auto mb-8 brightness-0 invert" />
          <p className="text-[10px] tracking-[0.32em] uppercase text-gold font-head font-semibold mb-5">The story behind the crest</p>
          <h1 className="font-display font-semibold text-5xl sm:text-6xl leading-[0.95]">Every wing<br />was once ash.</h1>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-5 py-20">
        <p className="text-[10px] tracking-[0.32em] uppercase text-gold-deep font-head font-semibold mb-4">Chapter one</p>
        <h2 className="font-display font-semibold text-4xl mb-6">Our story</h2>
        <p className="text-ink/70 leading-relaxed text-lg mb-5">
          A.F.T.E.R. ERA started with one simple idea: what we wear can hold a story. Every piece carries our phoenix crest — a gold reminder that you were not left in the fire. You rose from it.
        </p>
        <p className="text-ink/70 leading-relaxed text-lg">
          We design for the after, not just the ache — made to order, for anyone rebuilding a new chapter.
        </p>
      </div>
      <div className="bg-stone py-20">
        <div className="max-w-5xl mx-auto px-5 grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/5] overflow-hidden bg-ink">
            <img src="/hero.gif" alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-[10px] tracking-[0.32em] uppercase text-gold-deep font-head font-semibold mb-4">Chapter two</p>
            <h2 className="font-display font-semibold text-4xl mb-6">Why a phoenix</h2>
            <p className="text-ink/70 leading-relaxed mb-4">
              Legend says the phoenix does not run from the fire — it flies straight through it, and comes out glowing.
            </p>
            <p className="text-ink/70 leading-relaxed">
              Our crest sits inside a crowned letter A because rebuilding after something hard does not make you fragile. It makes you royalty.
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-5 py-20 text-center">
        <p className="text-[10px] tracking-[0.32em] uppercase text-gold-deep font-head font-semibold mb-4">Chapter three</p>
        <h2 className="font-display font-semibold text-4xl mb-8">Meet the founder</h2>
        <p className="font-display italic text-2xl sm:text-3xl leading-relaxed text-ink/80 mb-6">
          I didn&apos;t want a brand that pretended everything was fine. I wanted one that told the truth — and still had glitter on it.
        </p>
        <p className="text-ink/45 text-sm tracking-tr1 uppercase font-head">Founder, A.F.T.E.R. ERA</p>
      </div>
      <div className="text-center pb-20">
        <Link href="/shop" className="btn btn-primary">Shop the collection</Link>
      </div>
    </>
  );
}
