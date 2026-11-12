import { z } from "zod";

import type { RoleListQueryState, RoleListStatus, RoleListView, RoleMutationResponse, RoleRawResponse } from "./MasterRole.type";
import { RoleListItemSchema } from "./MasterRole.type";

const RoleListSchema = z.array(RoleListItemSchema);

/**
 * Build an empty list view for a state without rows.
 * @param {RoleListStatus} listStatus - List state to render
 * @returns {RoleListView} - List view without rows
 */
const _createEmptyListView = (listStatus: RoleListStatus): RoleListView => ({
  listStatus,
  roles: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Normalize the paged role query into list view data (single upstream fallback).
 * @param {RoleListQueryState} queryState - RTK Query data and flags
 * @returns {RoleListView} - Normalized list view data
 */
export const normalizeRoleList = (queryState: RoleListQueryState): RoleListView => {
  const { data, isLoading, isError } = queryState;

  if (isLoading) {
    return _createEmptyListView("loading");
  }

  if (isError) {
    return _createEmptyListView("error");
  }

  const parsedRoles = RoleListSchema.safeParse(data?.data);

  if (!data || !parsedRoles.success) {
    return _createEmptyListView("missing");
  }

  return {
    listStatus: parsedRoles.data.length === 0 ? "empty" : "ready",
    roles: parsedRoles.data,
    totalPages: data.total_pages,
    totalCount: data.total_count,
  };
};

/**
 * Calculate the display row number of a role table row.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} rowIndex - Zero-based row index
 * @returns {number} - One-based row number across pages
 */
export const getRoleRowNumber = (currentPage: number, pageSize: number, rowIndex: number): number => {
  return (currentPage - 1) * pageSize + rowIndex + 1;
};

/**
 * Normalize a role detail / mutation response: the backend sends one role or a list of one.
 * @param {RoleRawResponse} response - Raw response
 * @returns {RoleMutationResponse} - Response with a single role or null
 */
export const normalizeRoleResponse = (response: RoleRawResponse): RoleMutationResponse => ({
  ...response,
  data: Array.isArray(response.data) ? (response.data[0] ?? null) : response.data,
});
