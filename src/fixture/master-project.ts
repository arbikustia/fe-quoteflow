import type { ItemAllResponse } from "@/modules/master-data/master-item/MasterItem.type";
import type { ApiProject, ProjectDetailResponse, ProjectListResponse } from "@/modules/master-data/master-project/MasterProject.type";

import { MOCK_API_ITEMS } from "./master-item";

export const MOCK_API_PROJECTS: ApiProject[] = [
  {
    id: "project-1",
    name: "Wedding Package",
    remark: "Full stage setup",
    price: 5000000,
    status: 1,
    created_at: "2026-11-04 19:49:27",
    created_by: "admin",
    items: [{ id: "project-item-1", item_id: "item-1", item_name: "Beam 290", qty: 4, price: 100000, status: 1 }],
  },
  {
    id: "project-2",
    name: "Meeting Package",
    remark: null,
    price: 0,
    status: 0,
    created_at: null,
    created_by: null,
    items: null,
  },
];

export const MOCK_PROJECT_LIST_RESPONSE: ProjectListResponse = {
  data: MOCK_API_PROJECTS,
  page_number: 1,
  total_pages: 1,
  total_count: MOCK_API_PROJECTS.length,
  has_previous: false,
  has_next: false,
};

export const MOCK_PROJECT_DETAIL_RESPONSE: ProjectDetailResponse = {
  status: true,
  data: MOCK_API_PROJECTS[0],
  messages: null,
};

export const MOCK_PROJECT_ITEMS_RESPONSE: ItemAllResponse = {
  status: true,
  data: MOCK_API_ITEMS,
  messages: null,
};
