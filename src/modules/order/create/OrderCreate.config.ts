import type { OrderItemPayload } from "../Order.type";

/** Blank item row. */
export const EMPTY_ITEM: OrderItemPayload = { item_id: "", project_id: null, item_name: "", qty: 1, price: 0, subtotal: 0, remark: "" };
