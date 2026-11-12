import type { ApiOrderType, OrderTypeListResponse } from "@/modules/master-data/master-order-type/MasterOrderType.type";

export const MOCK_API_ORDER_TYPES: ApiOrderType[] = [
  {
    id: "order-type-1",
    name: "Delivery",
    is_handover: true,
    status: 1,
    created_at: "2026-10-30 21:09:24",
    updated_at: "2026-10-30 21:42:20",
  },
  {
    id: "order-type-2",
    name: "Pickup",
    is_handover: false,
    status: 0,
    created_at: null,
    updated_at: null,
  },
];

export const MOCK_ORDER_TYPE_LIST_RESPONSE: OrderTypeListResponse = {
  data: MOCK_API_ORDER_TYPES,
  page_number: 1,
  total_pages: 1,
  total_count: MOCK_API_ORDER_TYPES.length,
  has_previous: false,
  has_next: false,
};
