import { getShopId } from "./printify";
import type { CartItem, CheckoutPayload } from "./types";

export async function createPrintifyOrder(payload: CheckoutPayload) {
  const token = process.env.PRINTIFY_API_TOKEN;
  if (!token) return { ok: false as const, code: "PRINTIFY_NOT_CONFIGURED" };
  const shopId = await getShopId();
  if (!shopId) return { ok: false as const, code: "NO_SHOP" };
  const line_items = payload.items.map((item: CartItem) => ({
    product_id: item.productId,
    variant_id: Number(item.variantId),
    quantity: item.quantity
  }));
  const body = {
    line_items,
    shipping_method: 1,
    send_shipping_notification: true,
    address_to: {
      first_name: payload.firstName,
      last_name: payload.lastName,
      email: payload.email,
      address1: payload.address,
      city: payload.city,
      zip: payload.zip,
      country: payload.country || "US"
    }
  };
  const res = await fetch(`https://api.printify.com/v1/shops/${shopId}/orders.json`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "AfterEraStore/1.0"
    },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) return { ok: false as const, code: "PRINTIFY_ORDER_FAILED", data };
  return { ok: true as const, data };
}
