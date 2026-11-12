import type { ApiRole, RoleAllResponse, RoleListResponse, RoleMutationResponse } from "@/modules/master-data/master-role/MasterRole.type";

export const MOCK_API_ROLES: ApiRole[] = [
  { id: "role-1", role: "Administrator", status: 1, last_created: "2026-10-30 22:00:54" },
  { id: "role-2", role: "Sales", status: 0, last_created: null },
];

export const MOCK_ROLE_LIST_RESPONSE: RoleListResponse = {
  data: MOCK_API_ROLES,
  page_number: 1,
  total_pages: 1,
  total_count: MOCK_API_ROLES.length,
  has_previous: false,
  has_next: false,
};

export const MOCK_ROLE_DETAIL_RESPONSE: RoleMutationResponse = {
  status: true,
  data: MOCK_API_ROLES[0],
  messages: null,
};

export const MOCK_ROLE_ALL_RESPONSE: RoleAllResponse = {
  status: true,
  data: [
    { id: "role-1", role: "Administrator", status: 1 },
    { id: "role-2", role: "Sales", status: 0 },
  ],
  messages: null,
};
