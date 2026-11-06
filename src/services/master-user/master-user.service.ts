import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import type { ApiBaseData, ApiBaseItem } from "@/types/api.type";

import ENDPOINT from "@/constants/endpoint.constant";
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

/** Normalize API messages to one source shape. */
const _normalizeMessages = (messages: ApiBaseData["messages"]): string[] => {
  if (Array.isArray(messages)) return messages;

  return messages ? [messages] : [];
};

/** Normalize API role to one source shape. */
const _normalizeRole = (role?: string): string[] | undefined => role ? [role] : undefined;

/** Map raw user data to normalized API user. */
const _normalizeUser = (data?: ApiBaseItem): ApiUser | undefined => {
  if (!data?.id) return undefined;

  return {
    id: data.id,
    ...(data.username ? { username: data.username } : {}),
    ...(data.email ? { email: data.email } : {}),
    ...(data.password ? { password: data.password } : {}),
    ...(_normalizeRole(data.role) ? { role: _normalizeRole(data.role) } : {}),
    ...(data.status !== undefined ? { status: data.status } : {}),
    ...(data.last_created ? { last_created: data.last_created } : {}),
  };
};

/**
 * Normalize raw user response at service boundary.
 * @param {ApiBaseData} response - Raw user response
 * @returns {UserDetailResponse} Normalized user response
 */
export const normalizeUserDetailResponse = (response: ApiBaseData): UserDetailResponse => {
  const data = Array.isArray(response.data) ? response.data[0] : response.data ?? undefined;
  const user = _normalizeUser(data);

  return { status: response.status, ...(user ? { data: user } : {}), messages: _normalizeMessages(response.messages) };
};

/**
 * Map API user model to UI model.
 * @param {ApiUser} item - API user
 * @returns {UserData} UI user
 */
export const mapUser = (item: ApiUser): UserData => ({
  id: item.id,
  ...(item.username ? { username: item.username } : {}),
  ...(item.email ? { email: item.email } : {}),
  ...(item.role?.[0] ? { role: item.role[0] } : {}),
  status: item.status === 0 ? "inactive" : "active",
  ...(item.last_created ? { createAt: item.last_created } : {}),
});

export const masterUserService = apiRtkClient.injectEndpoints({
  /**
   *
   * @param builder
   */
  endpoints: (builder) => ({
    getUsers: builder.query<UserListResponse, UserListParams>({
      /**
       *
       * @param params
       */
      query: (params) => ({ url: ENDPOINT.MASTER_USER.PAGED, method: "GET", params }),
      providesTags: ["User"],
    }),
    createUser: builder.mutation<UserCreateResponse, UserCreatePayload>({
      /**
       *
       * @param body
       */
      query: (body) => ({ url: ENDPOINT.MASTER_USER.CREATE, method: "POST", data: body }),
      invalidatesTags: ["User"],
    }),
    getUserById: builder.query<UserDetailResponse, string>({
      transformResponse: normalizeUserDetailResponse,
      /**
       *
       * @param id
       */
      query: (id) => ({ url: `${ENDPOINT.MASTER_USER.DETAIL}/${id}`, method: "GET" }),
      providesTags: ["User"],
    }),
    updateUser: builder.mutation<UserCreateResponse, UserUpdatePayload>({
      /**
       *
       * @param body
       */
      query: (body) => ({
        url: `${ENDPOINT.MASTER_USER.DETAIL}/${body.id}`,
        method: "PUT",
        data: {
          username: body.username,
          email: body.email,
          status: body.status,
          role: body.role,
        },
      }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery, useCreateUserMutation, useGetUserByIdQuery, useUpdateUserMutation } = masterUserService;
