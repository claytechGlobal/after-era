"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/products";
import { useCart } from "./CartProvider";

export function CartDrawer() {
  const { items, open, setOpen, remove, setQty, subtotal } = useCart();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80]">
      <button className="absolute inset-0 bg-ink/50" aria-label="Close cart" onClick={() => setOpen(false)} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-paper flex flex-col">
        <div className="flex items-center justify-between px-6 py-6 border-b border-line">
          <h2 className="font-head font-extrabold tracking-tr1 uppercase text-sm">Your bag</h2>
          <button onClick={() => setOpen(false)} className="text-[11px] tracking-tr1 uppercase text-ink/50">Close</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-3xl mb-2">Empty for now</p>
              <p className="text-sm text-ink/50 mb-8">The collection is waiting.</p>
              <Link href="/shop" onClick={() => setOpen(false)} className="btn btn-primary">Shop now</Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.variantId} className="flex gap-4">
                <div className="w-20 h-24 bg-stone overflow-hidden shrink-0">
                  <img src={item.image || "/hoodie.png"} alt="" className="w-full h-full object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-head font-semibold text-sm leading-snug">{item.title}</p>
                  <p className="text-xs text-ink/45 mt-1">{item.variantTitle}</p>
                  <p className="text-sm mt-1">{formatPrice(item.price)}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => setQty(item.variantId, item.quantity - 1)} className="w-7 h-7 border border-line">-</button>
                    <span className="text-sm w-4 text-center">{item.quantity}</span>
                    <button onClick={() => setQty(item.variantId, item.quantity + 1)} className="w-7 h-7 border border-line">+</button>
                    <button onClick={() => remove(item.variantId)} className="ml-auto text-[10px] uppercase tracking-tr1 text-ink/40">Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {items.length ? (
          <div className="border-t border-line px-6 py-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm">Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-ink/45 mb-5">Free shipping on orders over $75.</p>
            <Link href="/checkout" onClick={() => setOpen(false)} className="btn btn-primary w-full">Checkout</Link>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
