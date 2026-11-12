import type { ChangeEvent } from "react";
import { z } from "zod";

import { formatIndonesianDateTime } from "@/utils/date.helpers";

import type { ApiEnvelope, PaginatedResponse } from "@/types/api.type";

import { ROLE_ACTIVE_STATUS, ROLE_EMPTY_VALUE } from "./MasterRole.config";

/** Role status as shown in the UI. */
export type RoleStatus = "active" | "inactive";

/** API status code (`1` = active) mapped to the UI status. */
const RoleStatusSchema = z
  .number()
  .catch(0)
  .transform((status): RoleStatus => (status === ROLE_ACTIVE_STATUS ? "active" : "inactive"));

/** API timestamp formatted for display, with a placeholder when absent. */
const RoleDateSchema = z
  .string()
  .nullish()
  .transform((value): string => (value ? formatIndonesianDateTime(value) : ROLE_EMPTY_VALUE));

/** Raw role record as returned by `GET /api/role/paged`. */
export const ApiRoleSchema = z.object({
  id: z.string(),
  role: z.string().nullish(),
  status: z.number(),
  last_created: z.string().nullish(),
});

/** Raw role record as returned by the API. */
export type ApiRole = z.input<typeof ApiRoleSchema>;

/** Role row normalized for display. */
export const RoleListItemSchema = ApiRoleSchema.transform((role) => ({
  id: role.id,
  name: role.role || ROLE_EMPTY_VALUE,
  status: RoleStatusSchema.parse(role.status),
  createdAt: RoleDateSchema.parse(role.last_created),
}));

/** Role row ready for the list view. */
export type RoleData = z.output<typeof RoleListItemSchema>;

/** Paged role list response. */
export type RoleListResponse = PaginatedResponse<ApiRole>;

/** Role as returned by the select-all endpoint (`GET /api/role/get-all-role`). */
export type RoleOption = {
  id: string;
  role: string;
  status: number;
};

/** Select-all role response. */
export type RoleAllResponse = ApiEnvelope<RoleOption[]>;

/** Detail / create / update response as sent by the backend: one role or a list of one. */
export type RoleRawResponse = ApiEnvelope<ApiRole | ApiRole[] | null>;

/** Detail / create / update response normalized at the service boundary. */
export type RoleMutationResponse = ApiEnvelope<ApiRole | null>;

/** Create Role request body. */
export type RoleCreatePayload = {
  role: string;
  status: number;
};

/** Update Role request body. */
export type RoleUpdatePayload = RoleCreatePayload & {
  id: string;
};

/** Paged role list query params. */
export type RoleListParams = {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
};

/** Which part of the list view is rendered. */
export type RoleListStatus = "loading" | "error" | "missing" | "empty" | "ready";

/** List statuses that render a message instead of rows. */
export type RoleListMessageStatus = Exclude<RoleListStatus, "loading" | "ready">;

/** Normalized paged list data. */
export type RoleListView = {
  listStatus: RoleListStatus;
  roles: RoleData[];
  totalPages: number;
  totalCount: number;
};

/** Raw RTK Query state consumed by the list normalizer. */
export type RoleListQueryState = {
  data?: RoleListResponse;
  isLoading: boolean;
  isError: boolean;
};

/** Router state the list page receives after a create / update. */
export type RoleRouteState = {
  successMessage?: string;
} | null;

/** Paging and search state of the role list. */
export type RoleListPaging = {
  queryParams: RoleListParams;
  currentPage: number;
  pageSize: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

/** Navigation handlers of the role list. */
export type RoleNavigation = {
  handleBack: () => void;
  handleCreate: () => void;
  handleEdit: (role: RoleData) => void;
};

/** Role list state and handlers owned by the module hook. */
export type MasterRoleController = RoleListPaging & RoleNavigation;

/** Props of the role mobile card. */
export type RoleMobileCardProps = {
  role: RoleData;
  canEdit: boolean;
  onEdit: (role: RoleData) => void;
};

/** Props of the role list view. */
export type MasterRoleProps = RoleListView & {
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
  onEdit: (role: RoleData) => void;
};
