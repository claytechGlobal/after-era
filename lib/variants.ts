import type { StoreProduct } from "./types";

function norm(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function optionValue(variant: StoreProduct["variants"][number], optionName: string) {
  if (variant.options[optionName]) return variant.options[optionName];
  const key = Object.keys(variant.options).find(
    (k) => k.toLowerCase() === optionName.toLowerCase() || k.toLowerCase().replace(/s$/, "") === optionName.toLowerCase().replace(/s$/, "")
  );
  return key ? variant.options[key] : "";
}

export function findVariant(product: StoreProduct, selected: Record<string, string>) {
  const opts = product.options;
  return product.variants.find((v) =>
    opts.every((opt) => {
      const want = norm(selected[opt.name] || "");
      if (!want) return true;
      const got = norm(optionValue(v, opt.name));
      if (got === want) return true;
      const parts = v.title.split("/").map((part) => norm(part));
      return parts.includes(want);
    })
  );
}

export function optionAvailable(product: StoreProduct, selected: Record<string, string>, optionName: string, value: string) {
  return Boolean(findVariant(product, { ...selected, [optionName]: value }));
}

export function variantLabel(product: StoreProduct, selected: Record<string, string>, variantTitle: string) {
  const fromSelection = product.options.map((opt) => selected[opt.name]).filter(Boolean).join(" / ");
  return fromSelection || variantTitle;
}

export function imageIndexForVariant(product: StoreProduct, variantId?: string) {
  if (!variantId) return 0;
  const index = product.images.findIndex((img) => img.variantIds?.includes(variantId));
  return index >= 0 ? index : 0;
}

export function sameOption(a?: string, b?: string) {
  return norm(a || "") === norm(b || "");
}

export function variantHasValue(variant: StoreProduct["variants"][number], optionName: string, value: string) {
  if (sameOption(optionValue(variant, optionName), value)) return true;
  return variant.title.split("/").map((part) => norm(part)).includes(norm(value));
}
