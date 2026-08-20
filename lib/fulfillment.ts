import { allShopIds, getShopId } from "./printify";
import type { CartItem, CheckoutPayload } from "./types";

function printifyToken() {
  return (process.env.PRINTIFY_API_TOKEN || "").replace(/\s+/g, "").replace(/^["']+|["']+$/g, "");
}

async function postOrder(shopId: string, payload: CheckoutPayload, items: CartItem[], externalId?: string) {
  const token = printifyToken();
  const line_items = items
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
      phone: payload.phone || "0000000000",
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

export async function createPrintifyOrder(payload: CheckoutPayload, externalId?: string) {
  const token = printifyToken();
  if (!token) return { ok: false as const, code: "PRINTIFY_NOT_CONFIGURED" };
  const groups = new Map<string, CartItem[]>();
  payload.items.forEach((item) => {
    const key = item.shopId || "_";
    groups.set(key, [...(groups.get(key) || []), item]);
  });
  const fallback = (await allShopIds()).concat((await getShopId()) || []);
  let any = false;
  for (const [shopKey, items] of groups) {
    const candidates = shopKey !== "_" ? [shopKey, ...fallback] : fallback;
    let placed = false;
    for (const shopId of [...new Set(candidates.filter(Boolean))]) {
      const result = await postOrder(shopId, payload, items, externalId);
      if (result.ok) {
        placed = true;
        any = true;
        break;
      }
    }
    if (!placed) return { ok: false as const, code: "PRINTIFY_ORDER_FAILED" };
  }
  return any ? { ok: true as const } : { ok: false as const, code: "NO_SHOP" };
}
