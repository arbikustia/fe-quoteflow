import type { ApiItem, ItemListResponse } from "@/modules/master-data/master-item/MasterItem.type";

export const MOCK_API_ITEMS: ApiItem[] = [
  {
    id: "item-1",
    name: "Beam 290",
    category_id: "category-1",
    category_name: "Lighting Equipment",
    price: 100000,
    stock: 11,
    image: "https://cdn.example.com/api/image/beam-290.jpg",
    duration: 1,
    remark: "Lighting",
    status: 1,
    created_at: "2026-11-04 19:49:27",
    created_by: null,
  },
  {
    id: "item-2",
    name: "Wireless Mic",
    category_id: null,
    category_name: null,
    price: null,
    stock: null,
    image: null,
    duration: null,
    remark: null,
    status: 0,
    created_at: null,
    created_by: null,
  },
];

export const MOCK_ITEM_LIST_RESPONSE: ItemListResponse = {
  data: MOCK_API_ITEMS,
  page_number: 1,
  total_pages: 1,
  total_count: MOCK_API_ITEMS.length,
  has_previous: false,
  has_next: false,
  status: true,
  messages: null,
};
