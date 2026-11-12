import type { ChangeEvent } from "react";
import { z } from "zod";

import { formatIndonesianDateTime } from "@/utils/date.helpers";

import type { ApiEnvelope, ApiQueryParams, PaginatedResponse } from "@/types/api.type";

import { USER_EMPTY_VALUE, USER_INACTIVE_STATUS } from "./MasterUser.config";

/** User status as shown in the UI. */
export type UserStatus = "active" | "inactive";

/** API status code (`0` = inactive, anything else or absent = active) mapped to the UI status. */
const UserStatusSchema = z
  .number()
  .nullish()
  .transform((status): UserStatus => (status === USER_INACTIVE_STATUS ? "inactive" : "active"));

/** API timestamp formatted for display, with a placeholder when absent. */
const UserDateSchema = z
  .string()
  .nullish()
  .transform((value): string => (value ? formatIndonesianDateTime(value) : USER_EMPTY_VALUE));

/** Role value sent by the backend: one role or a list of roles. */
const ApiUserRoleSchema = z.union([z.string(), z.array(z.string())]).nullish();

/** First role of the API role value, with a placeholder when absent. */
const UserRoleSchema = ApiUserRoleSchema.transform((role): string => (Array.isArray(role) ? role[0] : role) || USER_EMPTY_VALUE);

/** Raw user record as returned by `GET /api/users/paged`. */
export const ApiUserSchema = z.object({
  id: z.string(),
  username: z.string().nullish(),
  email: z.string().nullish(),
  password: z.string().nullish(),
  role: ApiUserRoleSchema,
  status: z.number().nullish(),
  last_created: z.string().nullish(),
});

/** Raw user record as returned by the API. */
export type ApiUser = z.input<typeof ApiUserSchema>;

/** User row normalized for display. */
export const UserListItemSchema = ApiUserSchema.transform((user) => ({
  id: user.id,
  username: user.username || USER_EMPTY_VALUE,
  email: user.email || USER_EMPTY_VALUE,
  role: UserRoleSchema.parse(user.role),
  status: UserStatusSchema.parse(user.status),
  createdAt: UserDateSchema.parse(user.last_created),
}));

/** User row ready for the list view. */
export type UserData = z.output<typeof UserListItemSchema>;

/** Paged user list response. */
export type UserListResponse = PaginatedResponse<ApiUser>;

/** Detail / create / update response as sent by the backend: one user or a list of one. */
export type UserRawResponse = ApiEnvelope<ApiUser | ApiUser[] | null>;

/** Detail / create / update response normalized at the service boundary. */
export type UserMutationResponse = ApiEnvelope<ApiUser | null>;

/** Create User request body. */
export type UserCreatePayload = {
  username: string;
  email: string;
  password: string;
  role: string[];
  status: number;
};

/** Update User request body. */
export type UserUpdatePayload = {
  id: string;
  username: string;
  email: string;
  role: string[];
  status: number;
};

/** Paged user list query params (also used by the permission, sidebar and profile lookups). */
export type UserListParams = ApiQueryParams;

/** Which part of the list view is rendered. */
export type UserListStatus = "loading" | "error" | "missing" | "empty" | "ready";

/** List statuses that render a message instead of rows. */
export type UserListMessageStatus = Exclude<UserListStatus, "loading" | "ready">;

/** Normalized paged list data. */
export type UserListView = {
  listStatus: UserListStatus;
  users: UserData[];
  totalPages: number;
  totalCount: number;
};

/** Raw RTK Query state consumed by the list normalizer. */
export type UserListQueryState = {
  data?: UserListResponse;
  isLoading: boolean;
  isError: boolean;
};

/** Router state the list page receives after a create / update. */
export type UserRouteState = {
  successMessage?: string;
} | null;

/** Paging and search state of the user list. */
export type UserListPaging = {
  queryParams: UserListParams;
  currentPage: number;
  pageSize: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

/** Navigation handlers of the user list. */
export type UserNavigation = {
  handleBack: () => void;
  handleCreate: () => void;
  handleEdit: (user: UserData) => void;
};

/** User list state and handlers owned by the module hook. */
export type MasterUserController = UserListPaging & UserNavigation;

/** Props of the user mobile card. */
export type UserMobileCardProps = {
  user: UserData;
  canEdit: boolean;
  onEdit: (user: UserData) => void;
};

/** Props of the user list view. */
export type MasterUserProps = UserListView & {
  currentPage: number;
  pageSize: number;
  canCreate: boolean;
  canEdit: boolean;
  successMessage?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onCreate: () => void;
  onEdit: (user: UserData) => void;
};
