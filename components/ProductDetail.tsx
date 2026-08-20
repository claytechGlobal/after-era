"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "./CartProvider";
import type { StoreProduct } from "@/lib/types";
import { displayTitle, formatPrice } from "@/lib/products";
import { findVariant, imageIndexForVariant, optionAvailable, sameOption, variantHasValue, variantLabel } from "@/lib/variants";

export function ProductDetail({ product }: { product: StoreProduct }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const initial = useMemo(() => {
    const first = product.variants[0];
    if (first && Object.keys(first.options).length) return { ...first.options };
    const sel: Record<string, string> = {};
    product.options.forEach((opt) => {
      sel[opt.name] = opt.values[0];
    });
    return sel;
  }, [product]);
  const [selected, setSelected] = useState<Record<string, string>>(initial);

  const variant = findVariant(product, selected);
  const price = variant?.price || product.price;
  const img = product.images[active]?.src || product.images[0]?.src || "/hoodie.png";

  useEffect(() => {
    if (!variant) return;
    setActive(imageIndexForVariant(product, variant.id));
  }, [product, variant]);

  function choose(name: string, value: string) {
    setSelected((current) => {
      const next = { ...current, [name]: value };
      if (findVariant(product, next)) return next;
      const match = product.variants.find((v) => variantHasValue(v, name, value));
      if (match && Object.keys(match.options).length) return { ...match.options };
      return next;
    });
  }

  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-20">
      <div>
        <div className="bg-stone aspect-[4/5] overflow-hidden">
          <img src={img} alt="" className="w-full h-full object-contain p-6" />
        </div>
        {product.images.length > 1 ? (
          <div className="grid grid-cols-5 gap-2 mt-3">
            {product.images.slice(0, 10).map((im, i) => (
              <button key={im.src + i} onClick={() => setActive(i)} className={`aspect-square overflow-hidden bg-stone border ${i === active ? "border-ink" : "border-transparent"}`}>
                <img src={im.src} alt="" className="w-full h-full object-contain p-1" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="lg:pt-8">
        <p className="text-[10px] tracking-[0.28em] uppercase text-gold-deep font-head font-semibold mb-4">{product.category}</p>
        <h1 className="font-display font-semibold text-4xl sm:text-5xl leading-[1.08] mb-4">{displayTitle(product.title)}</h1>
        <p className="text-lg mb-8">{formatPrice(price)}</p>
        {product.description ? <p className="text-ink/65 leading-relaxed mb-10 max-w-md">{product.description}</p> : null}
        {product.options.map((opt) => (
          <div key={opt.name} className="mb-7">
            <p className="font-head text-[10px] tracking-tr1 uppercase mb-3">{opt.name}</p>
            <div className="flex flex-wrap gap-2">
              {opt.values.map((val) => {
                const on = sameOption(selected[opt.name], val);
                const available = optionAvailable(product, selected, opt.name, val);
                return (
                  <button
                    key={val}
                    onClick={() => choose(opt.name, val)}
                    className={`min-w-11 px-3 py-2 text-[11px] font-head tracking-tr1 uppercase border ${on ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"} ${available ? "" : "opacity-35"}`}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <div className="flex items-center gap-4 mb-8">
          <p className="font-head text-[10px] tracking-tr1 uppercase">Qty</p>
          <button className="w-9 h-9 border border-line" onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
          <span className="w-6 text-center">{qty}</span>
          <button className="w-9 h-9 border border-line" onClick={() => setQty((q) => q + 1)}>+</button>
        </div>
        <button
          className="btn btn-primary w-full sm:w-auto"
          disabled={!variant || variant.available === false}
          onClick={() => {
            if (!variant) return;
            add({
              productId: product.id,
              variantId: variant.id,
              shopId: product.shopId,
              title: displayTitle(product.title),
              variantTitle: variantLabel(product, selected, variant.title),
              image: img,
              price: variant.price,
              quantity: qty
            });
          }}
        >
          {variant && variant.available !== false ? "Add to bag" : variant ? "Out of stock" : "Select options"}
        </button>
          {variant && variant.available !== false ? (
          <p className="text-xs text-ink/45 mt-3">{variantLabel(product, selected, variant.title)}</p>
        ) : variant ? (
          <p className="text-xs text-ink/55 mt-3">This combination is out of stock. Pick another color or size.</p>
        ) : (
          <p className="text-xs text-ink/55 mt-3">That color/size mix is not available. Pick another combination.</p>
        )}
        <div className="gold-rule my-8" />
        <p className="text-xs text-ink/45 leading-relaxed max-w-sm">Made to order. Allow 2–7 days for production. Returns within 14 days for defects or print errors only.</p>
      </div>
    </div>
  );
}
