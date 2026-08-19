"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "@/components/CartProvider";

export default function SuccessPage() {
  const { clear } = useCart();
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    clear();
  }, [clear]);
  return (
    <div className="max-w-xl mx-auto px-5 py-24 text-center">
      <p className="text-[11px] tracking-tr2 uppercase text-gold-deep font-head font-semibold mb-4">Order confirmed</p>
      <h1 className="font-display font-semibold text-4xl mb-4">Thank you</h1>
      <p className="text-ink/70 mb-8">
        Your payment was received. You will get an email confirmation, then tracking once the piece ships.
      </p>
      <Link href="/shop" className="btn btn-primary">Continue shopping</Link>
    </div>
  );
}
