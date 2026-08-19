import { NextResponse } from "next/server";

export async function POST(_req: Request) {
  return NextResponse.json({ received: false, code: "STRIPE_WEBHOOK_NOT_ENABLED" }, { status: 501 });
}
