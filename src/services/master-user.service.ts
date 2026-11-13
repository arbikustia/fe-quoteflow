import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constants/endpoint.constant";

import type {
  UserCreatePayload,
  UserListParams,
  UserListResponse,
  UserMutationResponse,
  UserRawResponse,
  UserUpdatePayload,
} from "@/modules/master-data/master-user/MasterUser.type";
import { normalizeUserResponse } from "@/modules/master-data/master-user/MasterUser.util";

export const masterUserService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserListResponse, UserListParams>({
      query: (params) => ({ url: ENDPOINT.MASTER_USER.PAGED, method: "GET", params }),
      providesTags: ["User"],
    }),
    getUserById: builder.query<UserMutationResponse, string>({
      query: (id) => ({ url: `${ENDPOINT.MASTER_USER.DETAIL}/${id}`, method: "GET" }),
      transformResponse: (response: UserRawResponse): UserMutationResponse => normalizeUserResponse(response),
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),
    createUser: builder.mutation<UserMutationResponse, UserCreatePayload>({
      query: (body) => ({ url: ENDPOINT.MASTER_USER.CREATE, method: "POST", data: body }),
      transformResponse: (response: UserRawResponse): UserMutationResponse => normalizeUserResponse(response),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation<UserMutationResponse, UserUpdatePayload>({
      query: ({ id, ...body }) => ({ url: `${ENDPOINT.MASTER_USER.DETAIL}/${id}`, method: "PUT", data: body }),
      transformResponse: (response: UserRawResponse): UserMutationResponse => normalizeUserResponse(response),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery, useGetUserByIdQuery, useCreateUserMutation, useUpdateUserMutation } = masterUserService;
