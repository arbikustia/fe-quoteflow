import ENDPOINT from "@/constant/endpoint.const";
import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";
import type { UserData } from "@/modules/master-user/MasterUser.type";
import type { ApiEnvelope, ApiQueryParams, PaginatedResponse } from "@/types/api.type";

export type ApiUser = {
  readonly id: string;
  readonly username: string | null;
  readonly email: string | null;
  readonly password: string | null;
  readonly role: string[] | null;
  readonly last_created: string | null;
};

export type UserListResponse = PaginatedResponse<ApiUser>;
export type UserDetailResponse = ApiEnvelope<ApiUser | ApiUser[] | null>;
export type UserCreateResponse = ApiEnvelope<ApiUser | null>;
export type UserListParams = ApiQueryParams;

export type UserCreatePayload = {
  readonly username: string;
  readonly email?: string | null;
  readonly password?: string;
  readonly role?: readonly string[];
  readonly status?: number;
};

export type UserUpdatePayload = {
  readonly id: string;
  readonly username?: string;
  readonly email?: string | null;
  readonly password?: string;
  readonly role?: readonly string[];
  readonly status?: number;
};

/** Map API user model to UI model. */
export const mapUser = (item: ApiUser): UserData => ({
  id: item.id,
  username: item.username ?? "",
  email: item.email ?? "",
  role: (item.role?.[0] as "Admin" | "User") ?? "User",
  status: "active",
  createAt: item.last_created ?? "",
  createBy: "",
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
