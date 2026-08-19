import { ProductDetail } from "@/components/ProductDetail";
import { getProduct, getProducts } from "@/lib/products";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();
  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <ProductDetail product={product} />
    </div>
  );
}
