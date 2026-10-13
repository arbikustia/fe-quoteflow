/* eslint-disable jsdoc/require-jsdoc */
import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import type {
  UserCreatePayload,
  UserCreateResponse,
  UserData,
  UserListParams,
  UserListResponse,
} from "./MasterUser.type";

/**
 * Map API user model to UserData UI model.
 * API does not expose role, status, or creator in list records.
 * @param {UserListResponse["data"]["data"][number]} user - Raw API user object
 * @returns {UserData} Mapped user model
 */
export const _mapUser = (
  user: UserListResponse["data"]["data"][number],
): UserData => ({
  id: user.id,
  username: user.username,
  role: null,
  status: null,
  createAt: user.last_created,
  createBy: null,
});

export const masterUserApi = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserListResponse, UserListParams>({
      query: (params) => ({
        url: "/api/users/paged",
        method: "GET",
        params: {
          PageNumber: params.pageNumber,
          PageSize: params.pageSize,
          SearchTerm: params.searchTerm,
        },
      }),
      providesTags: ["User"],
    }),
    createUser: builder.mutation<UserCreateResponse, UserCreatePayload>({
      query: (body) => ({
        url: "/api/users",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateUserMutation, useGetUsersQuery } = masterUserApi;
