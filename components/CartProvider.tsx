"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (variantId: string) => void;
  setQty: (variantId: string, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const KEY = "after-era-cart";

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
        const found = prev.find((p) => p.variantId === item.variantId);
        if (found) {
          return prev.map((p) =>
            p.variantId === item.variantId ? { ...p, quantity: p.quantity + item.quantity } : p
          );
        }
        return [...prev, item];
      });
      setOpen(true);
    };
    const remove = (variantId: string) => setItems((prev) => prev.filter((p) => p.variantId !== variantId));
    const setQty = (variantId: string, quantity: number) => {
      if (quantity < 1) return remove(variantId);
      setItems((prev) => prev.map((p) => (p.variantId === variantId ? { ...p, quantity } : p)));
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
