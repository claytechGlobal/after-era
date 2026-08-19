import { NextResponse } from "next/server";
import { printifyDebug } from "@/lib/printify";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({
    count: products.length,
    titles: products.map((p) => p.title),
    printify: printifyDebug()
  });
}
