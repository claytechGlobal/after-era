"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/shop/tops", label: "Tops" },
  { href: "/shop/accessories", label: "Accessories" },
  { href: "/about", label: "About" }
];

export function Header() {
  const [mobile, setMobile] = useState(false);
  const { count, setOpen } = useCart();
  const path = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md border-b border-line/80">
      <div className="max-w-7xl mx-auto px-5 h-[84px] grid grid-cols-3 items-center">
        <div className="flex items-center">
          <button className="md:hidden" aria-label="Menu" onClick={() => setMobile((v) => !v)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <line x1="3" y1="7" x2="21" y2="7" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="17" x2="21" y2="17" />
            </svg>
          </button>
          <nav className="hidden md:flex items-center gap-7 text-[11px] font-head font-semibold tracking-tr1 uppercase">
            {links.slice(0, 3).map((l) => (
              <Link key={l.href} href={l.href} className={path === l.href ? "text-gold-deep" : "hover:text-gold-deep"}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <Link href="/" className="justify-self-center text-center">
          <img src="/logo.png" alt="" className="h-9 w-9 object-contain mx-auto mb-1" />
          <span className="font-head font-extrabold text-[13px] tracking-[0.28em]">A.F.T.E.R. ERA</span>
        </Link>
        <div className="flex items-center justify-end gap-6">
          <Link href="/about" className="hidden md:block text-[11px] font-head font-semibold tracking-tr1 uppercase hover:text-gold-deep">
            About
          </Link>
          <Link href="/care" className="hidden md:block text-[11px] font-head font-semibold tracking-tr1 uppercase hover:text-gold-deep">
            Care
          </Link>
          <button onClick={() => setOpen(true)} className="relative" aria-label="Bag">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 8h12l-1 12H7L6 8Z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-ink text-paper text-[9px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
              {count}
            </span>
          </button>
        </div>
      </div>
      {mobile ? (
        <div className="md:hidden border-t border-line bg-paper">
          <div className="px-5 py-6 flex flex-col gap-4 text-sm font-head font-semibold tracking-tr1 uppercase">
            <Link href="/" onClick={() => setMobile(false)}>Home</Link>
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMobile(false)}>{l.label}</Link>
            ))}
            <Link href="/shop/bottoms" onClick={() => setMobile(false)}>Bottoms</Link>
            <Link href="/shop/coordinate" onClick={() => setMobile(false)}>Coordinate</Link>
            <Link href="/care" onClick={() => setMobile(false)}>Customer Care</Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
