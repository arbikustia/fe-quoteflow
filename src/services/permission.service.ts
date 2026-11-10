import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import type { PermissionPayload, UserPermissionResponse } from "@/modules/permission/Permission.type";

import ENDPOINT from "@/constants/endpoint.constant";

/**
 * Build permission detail request.
 * @param {string} username - Selected username
 * @returns {{ url: string; method: string }} Permission request
 */
export const getPermissionRequest = (username: string): { url: string; method: string } => ({
  url: `${ENDPOINT.PERMISSION}/${encodeURIComponent(username)}`,
  method: "GET",
});

export const permissionService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getUserPermission: builder.query<UserPermissionResponse, string>({
      query: getPermissionRequest,
      providesTags: ["Permission"],
    }),
    saveUserPermission: builder.mutation<UserPermissionResponse, PermissionPayload>({
      query: (data) => ({ url: ENDPOINT.PERMISSION, method: "POST", data }),
      invalidatesTags: ["Permission"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetUserPermissionQuery, useSaveUserPermissionMutation } = permissionService;
