import { NextResponse } from "next/server";
import { createPrintifyOrder } from "@/lib/fulfillment";
import { verifyStripeWebhook } from "@/lib/payments";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const verified = verifyStripeWebhook(rawBody, req.headers.get("stripe-signature"));
  if (!verified.ok) {
    return NextResponse.json({ received: false }, { status: 400 });
  }
  const event = verified.event;
  if (event.type === "checkout.session.completed") {
    const session = event.data?.object;
    if (session?.payment_status && session.payment_status !== "paid") {
      return NextResponse.json({ received: true, skipped: true });
    }
    const meta = session?.metadata || {};
    let rawItems = meta.items || "";
    if (meta.itemParts) {
      rawItems = Array.from({ length: Number(meta.itemParts) }, (_, i) => meta[`items_${i}`] || "").join("");
    }
    let items: { productId: string; variantId: string; shopId?: string; quantity: number }[] = [];
    try {
      items = JSON.parse(rawItems || "[]");
    } catch {
      items = [];
    }
    if (items.length) {
      await createPrintifyOrder(
        {
          email: session?.customer_email || session?.customer_details?.email || meta.email || "",
          firstName: meta.firstName || "",
          lastName: meta.lastName || "",
          address: meta.address || "",
          city: meta.city || "",
          region: meta.region || "",
          zip: meta.zip || "",
          country: meta.country || "US",
          phone: meta.phone || "",
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            shopId: i.shopId,
            title: "",
            variantTitle: "",
            image: "",
            price: 0,
            quantity: i.quantity
          }))
        },
        session?.id
      );
    }
  }
  return NextResponse.json({ received: true });
}
