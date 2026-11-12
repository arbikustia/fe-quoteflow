import type { ApiCategory, CategoryListResponse } from "@/modules/master-data/master-category/MasterCategory.type";

export const MOCK_API_CATEGORIES: ApiCategory[] = [
  { id: "1", category_name: "Audio System", status: 1, created_at: "2024-02-01T00:00:00Z", created_by: "Admin" },
  { id: "2", category_name: "Lighting System", status: 0, created_at: "2024-04-01T00:00:00Z", created_by: "Admin" },
  { id: "3", category_name: "Special Effects", status: 1, created_at: null, created_by: null },
];

export const MOCK_CATEGORY_LIST_RESPONSE: CategoryListResponse = {
  data: MOCK_API_CATEGORIES,
  page_number: 1,
  total_pages: 1,
  total_count: MOCK_API_CATEGORIES.length,
  has_previous: false,
  has_next: false,
};
