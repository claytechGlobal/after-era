import type { CartItem, CheckoutPayload } from "./types";

export function paymentsEnabled() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

export function publicPaymentsEnabled() {
  return Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

function lineItems(items: CartItem[]) {
  return items.map((item) => ({
    quantity: item.quantity,
    price_data: {
      currency: "usd",
      unit_amount: item.price,
      product_data: {
        name: `${item.title}${item.variantTitle ? ` — ${item.variantTitle}` : ""}`,
        images: item.image && item.image.startsWith("http") ? [item.image] : []
      }
    }
  }));
}

export async function createStripeCheckoutSession(payload: CheckoutPayload) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return { ok: false as const, code: "PAYMENTS_DISABLED" };
  }
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("success_url", `${site}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
  body.set("cancel_url", `${site}/checkout`);
  body.set("customer_email", payload.email);
  body.set("metadata[firstName]", payload.firstName);
  body.set("metadata[lastName]", payload.lastName);
  body.set("metadata[address]", payload.address);
  body.set("metadata[city]", payload.city);
  body.set("metadata[zip]", payload.zip);
  body.set("metadata[country]", payload.country);
  body.set("metadata[items]", JSON.stringify(payload.items.map((i) => ({
    productId: i.productId,
    variantId: i.variantId,
    quantity: i.quantity
  }))));
  lineItems(payload.items).forEach((item, index) => {
    body.set(`line_items[${index}][quantity]`, String(item.quantity));
    body.set(`line_items[${index}][price_data][currency]`, item.price_data.currency);
    body.set(`line_items[${index}][price_data][unit_amount]`, String(item.price_data.unit_amount));
    body.set(`line_items[${index}][price_data][product_data][name]`, item.price_data.product_data.name);
    item.price_data.product_data.images.forEach((img, i) => {
      body.set(`line_items[${index}][price_data][product_data][images][${i}]`, img);
    });
  });
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

export async function verifyStripeWebhook(_rawBody: string, _signature: string | null) {
  return { ok: false as const, code: "STRIPE_WEBHOOK_NOT_ENABLED" };
}
