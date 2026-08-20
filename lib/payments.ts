import { createHmac, timingSafeEqual } from "crypto";
import type { CartItem, CheckoutPayload } from "./types";

function stripeSecret() {
  return (process.env.STRIPE_SECRET_KEY || "").replace(/\s+/g, "").replace(/^["']+|["']+$/g, "");
}

function webhookSecret() {
  return (process.env.STRIPE_WEBHOOK_SECRET || "").replace(/\s+/g, "").replace(/^["']+|["']+$/g, "");
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://after-era.com").replace(/\/$/, "");
}

export function paymentsEnabled() {
  return Boolean(stripeSecret());
}

export async function createStripeCheckoutSession(payload: CheckoutPayload) {
  const secret = stripeSecret();
  if (!secret) {
    return { ok: false as const, code: "PAYMENTS_DISABLED" };
  }
  const subtotal = payload.items.reduce((n, i) => n + i.price * i.quantity, 0);
  const shipping = subtotal >= 7500 ? 0 : 695;
  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("success_url", `${siteUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
  body.set("cancel_url", `${siteUrl()}/checkout`);
  body.set("customer_email", payload.email);
  body.set("metadata[email]", payload.email);
  body.set("metadata[firstName]", payload.firstName);
  body.set("metadata[lastName]", payload.lastName);
  body.set("metadata[address]", payload.address);
  body.set("metadata[city]", payload.city);
  body.set("metadata[region]", payload.region || "");
  body.set("metadata[zip]", payload.zip);
  body.set("metadata[country]", payload.country);
  body.set("metadata[phone]", payload.phone || "");
  const packed = JSON.stringify(
    payload.items.map((i) => ({
      productId: i.productId,
      variantId: i.variantId,
      shopId: i.shopId || "",
      quantity: i.quantity
    }))
  );
  if (packed.length <= 450) {
    body.set("metadata[items]", packed);
  } else {
    const parts = packed.match(/.{1,450}/g) || [];
    parts.forEach((part, i) => body.set(`metadata[items_${i}]`, part));
    body.set("metadata[itemParts]", String(parts.length));
  }
  payload.items.forEach((item, index) => {
    body.set(`line_items[${index}][quantity]`, String(item.quantity));
    body.set(`line_items[${index}][price_data][currency]`, "usd");
    body.set(`line_items[${index}][price_data][unit_amount]`, String(item.price));
    body.set(
      `line_items[${index}][price_data][product_data][name]`,
      `${item.title}${item.variantTitle ? ` — ${item.variantTitle}` : ""}`
    );
    if (item.image && item.image.startsWith("http")) {
      body.set(`line_items[${index}][price_data][product_data][images][0]`, item.image);
    }
  });
  body.set("shipping_options[0][shipping_rate_data][display_name]", shipping === 0 ? "Free shipping" : "Standard shipping");
  body.set("shipping_options[0][shipping_rate_data][type]", "fixed_amount");
  body.set("shipping_options[0][shipping_rate_data][fixed_amount][amount]", String(shipping));
  body.set("shipping_options[0][shipping_rate_data][fixed_amount][currency]", "usd");
  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });
  const data = await res.json();
  if (!res.ok) {
    return { ok: false as const, code: "STRIPE_ERROR", message: data.error?.message || "Stripe error" };
  }
  return { ok: true as const, url: data.url as string, id: data.id as string };
}

export function verifyStripeWebhook(rawBody: string, signature: string | null) {
  const secret = webhookSecret();
  if (!secret || !signature) return { ok: false as const };
  const entries = signature.split(",").map((part) => part.split("="));
  const t = entries.find((p) => p[0] === "t")?.[1];
  const signatures = entries.filter((p) => p[0] === "v1").map((p) => p[1]);
  if (!t || !signatures.length) return { ok: false as const };
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return { ok: false as const };
  const expected = createHmac("sha256", secret).update(`${t}.${rawBody}`).digest("hex");
  const valid = signatures.some((sig) => {
    try {
      const a = Buffer.from(expected, "utf8");
      const b = Buffer.from(sig, "utf8");
      return a.length === b.length && timingSafeEqual(a, b);
    } catch {
      return false;
    }
  });
  if (!valid) return { ok: false as const };
  return { ok: true as const, event: JSON.parse(rawBody) as StripeEvent };
}

type StripeEvent = {
  type?: string;
  data?: {
    object?: {
      id?: string;
      payment_status?: string;
      customer_email?: string;
      customer_details?: { email?: string };
      metadata?: Record<string, string>;
    };
  };
};

export type OrderItem = Pick<CartItem, "productId" | "variantId" | "quantity">;
