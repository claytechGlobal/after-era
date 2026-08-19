import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-ink text-paper mt-0">
      <div className="gold-rule" />
      <div className="max-w-7xl mx-auto px-5 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <img src="/logo.png" alt="" className="h-12 w-12 object-contain mb-4 brightness-0 invert" />
          <p className="font-head font-extrabold tracking-[0.22em] text-sm mb-3">A.F.T.E.R. ERA</p>
          <p className="text-sm text-paper/55 leading-relaxed">Wear your rise. Small-batch, made to order for the chapter after the fire.</p>
        </div>
        <div>
          <p className="font-head font-bold text-[10px] tracking-[0.28em] uppercase text-gold mb-4">Shop</p>
          <div className="flex flex-col gap-2.5 text-sm text-paper/75">
            <Link href="/shop">All products</Link>
            <Link href="/shop/tops">Tops</Link>
            <Link href="/shop/accessories">Accessories</Link>
            <Link href="/shop/bottoms">Bottoms</Link>
            <Link href="/shop/coordinate">Coordinate</Link>
          </div>
        </div>
        <div>
          <p className="font-head font-bold text-[10px] tracking-[0.28em] uppercase text-gold mb-4">House</p>
          <div className="flex flex-col gap-2.5 text-sm text-paper/75">
            <Link href="/about">About</Link>
            <Link href="/care">Customer Care</Link>
            <Link href="/legal">Terms & Policies</Link>
            <Link href="/legal#shipping">Shipping</Link>
            <Link href="/legal#refunds">Returns</Link>
          </div>
        </div>
        <div>
          <p className="font-head font-bold text-[10px] tracking-[0.28em] uppercase text-gold mb-4">Contact</p>
          <p className="text-sm text-paper/75">support@after-era.com</p>
          <p className="text-sm text-paper/45 mt-1">Mon–Fri, 9am–5pm</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-[10px] tracking-[0.28em] uppercase text-paper/40">
        © {new Date().getFullYear()} A.F.T.E.R. ERA · Made to order
      </div>
    </footer>
  );
}
