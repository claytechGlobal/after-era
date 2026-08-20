"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/products";
import { useCart } from "./CartProvider";

export function CheckoutForm() {
  const { items, subtotal } = useCart();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const shipping = subtotal >= 7500 || subtotal === 0 ? 0 : 695;
  const total = subtotal + shipping;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!items.length) return;
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    const payload = {
      email: String(form.get("email") || ""),
      firstName: String(form.get("firstName") || ""),
      lastName: String(form.get("lastName") || ""),
      address: String(form.get("address") || ""),
      city: String(form.get("city") || ""),
      region: String(form.get("region") || ""),
      zip: String(form.get("zip") || ""),
      country: String(form.get("country") || "US"),
      phone: String(form.get("phone") || ""),
      items
    };
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
      return;
    }
    setStatus("error");
    setMessage(data.message || "Could not start checkout.");
  }

  if (!items.length) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-3xl mb-3">Your bag is empty</p>
        <a href="/shop" className="btn btn-primary">Continue shopping</a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid lg:grid-cols-[1fr_360px] gap-10">
      <div>
        <h2 className="font-head font-bold text-sm tracking-tr1 uppercase mb-4">Shipping information</h2>
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          <input required name="firstName" placeholder="First name" className="border border-line px-4 py-3 text-sm" />
          <input required name="lastName" placeholder="Last name" className="border border-line px-4 py-3 text-sm" />
          <input required type="email" name="email" placeholder="Email" className="border border-line px-4 py-3 text-sm sm:col-span-2" />
          <input required name="address" placeholder="Address" className="border border-line px-4 py-3 text-sm sm:col-span-2" />
          <input required name="city" placeholder="City" className="border border-line px-4 py-3 text-sm" />
          <input required name="region" placeholder="State / Province" className="border border-line px-4 py-3 text-sm" />
          <input required name="zip" placeholder="ZIP" className="border border-line px-4 py-3 text-sm" />
          <input required name="phone" placeholder="Phone" className="border border-line px-4 py-3 text-sm" />
          <select name="country" className="border border-line px-4 py-3 text-sm sm:col-span-2" defaultValue="US">
            <option value="US">United States</option>
            <option value="CA">Canada</option>
          </select>
        </div>
        <h2 className="font-head font-bold text-sm tracking-tr1 uppercase mb-4">Payment</h2>
        <div className="border border-line p-5 mb-6 bg-stone">
          <p className="font-head text-xs tracking-tr1 uppercase mb-2">Secure checkout via Stripe</p>
          <p className="text-sm text-ink/65">You will pay on Stripe. Card details never touch this website.</p>
        </div>
        {message ? <p className="text-sm mb-4">{message}</p> : null}
        <button className="btn btn-primary" disabled={status === "loading"}>
          {status === "loading" ? "Redirecting…" : "Continue to payment"}
        </button>
      </div>
      <aside className="bg-stone p-6 h-fit">
        <h3 className="font-head font-bold text-sm tracking-tr1 uppercase mb-4">Order summary</h3>
        <div className="space-y-3 text-sm mb-4">
          {items.map((item) => (
            <div key={`${item.productId}::${item.variantId}`} className="flex justify-between gap-4">
              <span>
                {item.title}
                {item.variantTitle ? ` — ${item.variantTitle}` : ""} × {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-line pt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
          <div className="flex justify-between font-bold text-base pt-2 border-t border-line"><span>Total</span><span>{formatPrice(total)}</span></div>
        </div>
      </aside>
    </form>
  );
}
