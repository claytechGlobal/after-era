export type ProductCategory = "tops" | "bottoms" | "coordinate" | "accessories";

export type ProductImage = {
  src: string;
  alt: string;
  variantIds?: string[];
};

export type ProductOption = {
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  sku: string;
  price: number;
  available: boolean;
  options: Record<string, string>;
};

export type StoreProduct = {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  price: number;
  images: ProductImage[];
  options: ProductOption[];
  variants: ProductVariant[];
  tags: string[];
  createdAt?: string;
  shopId?: string;
};

export type CartItem = {
  productId: string;
  variantId: string;
  shopId?: string;
  title: string;
  variantTitle: string;
  image: string;
  price: number;
  quantity: number;
};

export type CheckoutPayload = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  region: string;
  zip: string;
  country: string;
  phone: string;
  items: CartItem[];
};
