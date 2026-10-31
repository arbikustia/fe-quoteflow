import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constant/endpoint.const";
import type { ActivityLogData, ActivityLogListParams, ActivityLogListResponse, ApiActivityLog } from "@/modules/activity-log/ActivityLog.type";

/** Map API activity log model to table row. */
export const mapActivityLog = (activityLog: ApiActivityLog): ActivityLogData => ({
  id: activityLog.id,
  userName: activityLog.user_name,
  action: activityLog.action,
  page: activityLog.page,
  description: activityLog.description,
  createdAt: activityLog.created_at,
});

export type ActivityLogPayload = {
  user_name: string;
  action: "create" | "edit" | "delete" | "view";
  page: string;
  description: string;
};

export const activityLogService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    createActivityLog: builder.mutation<{ status: boolean }, ActivityLogPayload>({
      query: (body) => ({ url: ENDPOINT.ACTIVITY_LOG.CREATE, method: "POST", data: body }),
      invalidatesTags: ["ActivityLog"],
    }),
    getActivityLogs: builder.query<ActivityLogListResponse, ActivityLogListParams>({
      query: (params) => ({
        url: ENDPOINT.ACTIVITY_LOG.PAGED,
        method: "GET",
        params: { PageNumber: params.pageNumber, PageSize: params.pageSize, SearchTerm: params.searchTerm },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useCreateActivityLogMutation, useGetActivityLogsQuery } = activityLogService;
