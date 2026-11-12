import { z } from "zod";

import type { UserListQueryState, UserListStatus, UserListView, UserMutationResponse, UserRawResponse } from "./MasterUser.type";
import { UserListItemSchema } from "./MasterUser.type";

const UserListSchema = z.array(UserListItemSchema);

/**
 * Build an empty list view for a state without rows.
 * @param {UserListStatus} listStatus - List state to render
 * @returns {UserListView} - List view without rows
 */
const _createEmptyListView = (listStatus: UserListStatus): UserListView => ({
  listStatus,
  users: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Normalize the paged user query into list view data (single upstream fallback).
 * @param {UserListQueryState} queryState - RTK Query data and flags
 * @returns {UserListView} - Normalized list view data
 */
export const normalizeUserList = (queryState: UserListQueryState): UserListView => {
  const { data, isLoading, isError } = queryState;

  if (isLoading) {
    return _createEmptyListView("loading");
  }

  if (isError) {
    return _createEmptyListView("error");
  }

  const parsedUsers = UserListSchema.safeParse(data?.data);

  if (!data || !parsedUsers.success) {
    return _createEmptyListView("missing");
  }

  return {
    listStatus: parsedUsers.data.length === 0 ? "empty" : "ready",
    users: parsedUsers.data,
    totalPages: data.total_pages,
    totalCount: data.total_count,
  };
};

/**
 * Calculate the display row number of a user table row.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} rowIndex - Zero-based row index
 * @returns {number} - One-based row number across pages
 */
export const getUserRowNumber = (currentPage: number, pageSize: number, rowIndex: number): number => {
  return (currentPage - 1) * pageSize + rowIndex + 1;
};

/**
 * Normalize a user detail / mutation response: the backend sends one user or a list of one.
 * @param {UserRawResponse} response - Raw response
 * @returns {UserMutationResponse} - Response with a single user or null
 */
export const normalizeUserResponse = (response: UserRawResponse): UserMutationResponse => ({
  ...response,
  data: Array.isArray(response.data) ? (response.data[0] ?? null) : response.data,
});
