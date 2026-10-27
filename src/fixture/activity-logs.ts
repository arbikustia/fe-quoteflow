import type { ActivityLogListResponse } from "@/modules/activity-log/ActivityLog.type";

export const MOCK_ACTIVITY_LOG_RESPONSE: ActivityLogListResponse = {
  status: true,
  data: [
    {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      user_name: "string",
      action: "string",
      page: "string",
      description: "string",
      created_at: "2026-10-27T18:35:12.125Z",
      updated_at: "2026-10-27T18:35:12.125Z",
    },
  ],
  messages: ["string"],
  page_number: 0,
  total_pages: 0,
  page_size: 0,
  total_count: 0,
  has_previous: true,
  has_next: true,
};
