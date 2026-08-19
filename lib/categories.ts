import type { ProductCategory } from "./types";

const TOP = ["hoodie", "hooded", "tee", "t-shirt", "tshirt", "sweatshirt", "crewneck", "tank", "crop", "long sleeve", "longsleeve", "top"];
const BOTTOM = ["jogger", "pant", "short", "sweatpant", "legging", "bottom", "trouser"];
const SET = ["coordinate", "set", "matching"];
const ACCESSORY = ["keychain", "charm", "mug", "sticker", "poster", "hat", "cap", "bag", "tote", "phone", "plate", "vanity"];

export function categorizeProduct(title: string, tags: string[] = []): ProductCategory {
  const hay = `${title} ${tags.join(" ")}`.toLowerCase();
  if (SET.some((k) => hay.includes(k))) return "coordinate";
  if (BOTTOM.some((k) => hay.includes(k))) return "bottoms";
  if (ACCESSORY.some((k) => hay.includes(k))) return "accessories";
  if (TOP.some((k) => hay.includes(k))) return "tops";
  return "tops";
}

export function categoryLabel(cat: string) {
  if (cat === "tops") return "Tops";
  if (cat === "bottoms") return "Bottoms";
  if (cat === "coordinate") return "Coordinate";
  if (cat === "accessories") return "Accessories";
  return "Shop";
}
