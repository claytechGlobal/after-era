import { getShopId } from "./printify";
import type { CheckoutPayload } from "./types";

function printifyToken() {
  return (process.env.PRINTIFY_API_TOKEN || "").replace(/\s+/g, "").replace(/^["']+|["']+$/g, "");
}

export async function createPrintifyOrder(payload: CheckoutPayload, externalId?: string) {
  const token = printifyToken();
  if (!token) return { ok: false as const, code: "PRINTIFY_NOT_CONFIGURED" };
  const shopId = await getShopId();
  if (!shopId) return { ok: false as const, code: "NO_SHOP" };
  const line_items = payload.items
    .map((item) => ({
      product_id: item.productId,
      variant_id: Number(item.variantId),
      quantity: item.quantity
    }))
    .filter((item) => item.product_id && Number.isFinite(item.variant_id));
  if (!line_items.length) return { ok: false as const, code: "NO_LINE_ITEMS" };
  const body = {
    external_id: externalId || undefined,
    line_items,
    shipping_method: 1,
    send_shipping_notification: true,
    address_to: {
      first_name: payload.firstName,
      last_name: payload.lastName,
      email: payload.email,
      phone: "",
      country: payload.country || "US",
      region: payload.region || "",
      address1: payload.address,
      address2: "",
      city: payload.city,
      zip: payload.zip
    }
  };
  const res = await fetch(`https://api.printify.com/v1/shops/${shopId}/orders.json`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "AfterEraStore/1.0 (after-era.com)"
    },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) return { ok: false as const, code: "PRINTIFY_ORDER_FAILED", data };
  const orderId = data?.id;
  if (orderId) {
    await fetch(`https://api.printify.com/v1/shops/${shopId}/orders/${orderId}/send.json`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "AfterEraStore/1.0 (after-era.com)"
      },
      body: "{}"
    });
  }
  return { ok: true as const, data };
}
