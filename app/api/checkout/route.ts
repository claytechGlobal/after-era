import { NextResponse } from "next/server";
import { createStripeCheckoutSession } from "@/lib/payments";
import type { CheckoutPayload } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const payload = (await req.json()) as CheckoutPayload;
  if (!payload?.email || !payload.items?.length) {
    return NextResponse.json({ code: "INVALID_CART" }, { status: 400 });
  }
  const result = await createStripeCheckoutSession(payload);
  if (!result.ok) {
    const status = result.code === "PAYMENTS_DISABLED" ? 503 : 400;
    return NextResponse.json(result, { status });
  }
  return NextResponse.json({ url: result.url, id: result.id });
}
