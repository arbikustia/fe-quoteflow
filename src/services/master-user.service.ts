import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constant/endpoint.const";
import type {
  ApiUser,
  UserCreatePayload,
  UserCreateResponse,
  UserData,
  UserDetailResponse,
  UserListParams,
  UserListResponse,
  UserUpdatePayload,
} from "@/modules/master-user/MasterUser.type";

/** Map API user model to UI model. */
export const mapUser = (item: ApiUser): UserData => ({
  id: item.id,
  username: item.username,
  email: item.email,
  role: item.role?.[0] ?? null,
  status: "active",
  createAt: item.last_created,
  createBy: null,
});

export const masterUserService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserListResponse, UserListParams>({
      query: (params) => ({ url: ENDPOINT.MASTER_USER.PAGED, method: "GET", params }),
      providesTags: ["User"],
    }),
    createUser: builder.mutation<UserCreateResponse, UserCreatePayload>({
      query: (body) => ({ url: ENDPOINT.MASTER_USER.CREATE, method: "POST", data: body }),
      invalidatesTags: ["User"],
    }),
    getUserById: builder.query<UserDetailResponse, string>({
      query: (id) => ({ url: `${ENDPOINT.MASTER_USER.DETAIL}/${id}`, method: "GET" }),
      providesTags: ["User"],
    }),
    updateUser: builder.mutation<UserCreateResponse, UserUpdatePayload>({
      query: (body) => ({
        url: `${ENDPOINT.MASTER_USER.DETAIL}/${body.id}`,
        method: "PUT",
        data: {
          username: body.username,
          email: body.email,
          password: body.password || undefined,
          role: body.role,
        },
      }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery, useCreateUserMutation, useGetUserByIdQuery, useUpdateUserMutation } = masterUserService;
