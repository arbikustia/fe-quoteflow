import type { ApiUser, UserListResponse, UserMutationResponse } from "@/modules/master-data/master-user/MasterUser.type";

export const MOCK_API_USERS: ApiUser[] = [
  { id: "user-1", username: "arbikustia14", email: "arbi@example.com", password: null, role: ["Administrator"], status: 1, last_created: "2026-10-30 22:00:54" },
  { id: "user-2", username: "johndoe", email: null, password: null, role: "Sales", status: 0, last_created: null },
];

export const MOCK_USER_LIST_RESPONSE: UserListResponse = {
  data: MOCK_API_USERS,
  page_number: 1,
  total_pages: 1,
  total_count: MOCK_API_USERS.length,
  has_previous: false,
  has_next: false,
};

export const MOCK_USER_DETAIL_RESPONSE: UserMutationResponse = {
  status: true,
  data: MOCK_API_USERS[0],
  messages: null,
};
