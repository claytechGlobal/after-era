"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/lib/types";

export function lineKey(item: { productId: string; variantId: string }) {
  return `${item.productId}::${item.variantId}`;
}

type CartContextValue = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (key: string) => void;
  setQty: (key: string, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const KEY = "after-era-cart-v2";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => {
    const add = (item: CartItem) => {
      setItems((prev) => {
        const key = lineKey(item);
        const found = prev.find((p) => lineKey(p) === key);
        if (found) {
          return prev.map((p) => (lineKey(p) === key ? { ...item, quantity: p.quantity + item.quantity } : p));
        }
        return [...prev, item];
      });
      setOpen(true);
    };
    const remove = (key: string) => setItems((prev) => prev.filter((p) => lineKey(p) !== key));
    const setQty = (key: string, quantity: number) => {
      if (quantity < 1) return remove(key);
      setItems((prev) => prev.map((p) => (lineKey(p) === key ? { ...p, quantity } : p)));
    };
    const clear = () => setItems([]);
    return {
      items,
      add,
      remove,
      setQty,
      clear,
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotal: items.reduce((n, i) => n + i.price * i.quantity, 0),
      open,
      setOpen
    };
  }, [items, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("cart");
  return ctx;
}
