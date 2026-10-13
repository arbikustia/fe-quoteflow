/* eslint-disable jsdoc/require-jsdoc */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { _mapUser, useCreateUserMutation, useGetUsersQuery } from "./MasterUser.api";
import type {
  MasterUserContainerState,
  MasterUserNavigation,
  MasterUserPagination,
  UserData,
  UserListApiState,
  UserListResponse,
} from "./MasterUser.type";

/**
 * Hook for master user navigation.
 * @returns {MasterUserNavigation} Navigation functions
 */
export const useMasterUserNavigation = (): MasterUserNavigation => {
  const navigate = useNavigate();

  const goBack = (): void => { navigate(-1); };
  const goCreate = (): void => { navigate("/master-user/create"); };
  const goEdit = (user: UserData): void => { navigate(`/master-user/edit/${user.id}`); };
  const goDetail = (user: UserData): void => { navigate(`/master-user/detail/${user.id}`); };

  return { goBack, goCreate, goEdit, goDetail };
};

/**
 * Hook for creating users through RTK Query.
 * @returns {ReturnType<typeof useCreateUserMutation>} Create-user mutation state
 */
export const useMasterUserCreate = (): ReturnType<typeof useCreateUserMutation> => useCreateUserMutation();

/**
 * Derive list state from user API query result.
 * @param {ReturnType<typeof useGetUsersQuery>} queryResult - RTK Query result
 * @returns {UserListApiState} Derived list state
 */
export const _deriveUserListState = (
  queryResult: ReturnType<typeof useGetUsersQuery>,
): UserListApiState => {
  const { data, error, isLoading } = queryResult;

  if (isLoading) {
    return _createUserListState(true, null, false);
  }

  if (error) {
    return _createUserListState(false, "Unable to load users.", false);
  }

  const response: UserListResponse | undefined = data;

  if (!response) {
    return _createUserListState(false, "No response received from server.", true);
  }

  if (!response.status) {
    return _createUserListState(false, "Unable to load users.", false);
  }

  if (!response.data) {
    return _createUserListState(false, "Response is missing data payload.", true);
  }

  return {
    isLoading: false,
    errorMessage: null,
    isMissingData: false,
    paginatedData: response.data.data.map(_mapUser),
    totalPages: response.data.total_pages,
    totalCount: response.data.total_count,
    hasNext: response.data.has_next,
    hasPrevious: response.data.has_previous,
  };
};

/**
 * Create non-success list state.
 * @param {boolean} isLoading - Loading flag
 * @param {string | null} errorMessage - User-facing error
 * @param {boolean} isMissingData - Missing-data flag
 * @returns {UserListApiState} List state
 */
const _createUserListState = (
  isLoading: boolean,
  errorMessage: string | null,
  isMissingData: boolean,
): UserListApiState => ({
  isLoading,
  errorMessage,
  isMissingData,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
  hasNext: false,
  hasPrevious: false,
});

/**
 * Hook for API-backed user pagination.
 * @returns {MasterUserPagination} Pagination state and handlers
 */
export const useMasterUserPagination = (): MasterUserPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const queryResult = useGetUsersQuery({ pageNumber: currentPage, pageSize, searchTerm: "" });
  const derived = _deriveUserListState(queryResult);

  const goToPage = (page: number): void => {
    setCurrentPage(Math.max(1, Math.min(page, derived.totalPages)));
  };
  const nextPage = (): void => {
    if (derived.hasNext) goToPage(currentPage + 1);
  };
  const prevPage = (): void => {
    if (derived.hasPrevious) goToPage(currentPage - 1);
  };
  const changePageSize = (size: number): void => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages: derived.totalPages,
    pageSize,
    paginatedData: derived.paginatedData,
    totalCount: derived.totalCount,
    isLoading: derived.isLoading,
    errorMessage: derived.errorMessage,
    isEmpty: !derived.isLoading && !derived.errorMessage && !derived.isMissingData && derived.paginatedData.length === 0,
    isMissingData: derived.isMissingData,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
  };
};

/**
 * Hook for master user container state.
 * @returns {MasterUserContainerState} Container state
 */
export const useMasterUserContainerState = (): MasterUserContainerState => {
  const navigation = useMasterUserNavigation();
  const pagination = useMasterUserPagination();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const toggleMore = (): void => { setIsMoreOpen((previous) => !previous); };
  const goDelete = (): void => { setIsMoreOpen(false); };
  const handleCloseMore = (): void => { setIsMoreOpen(false); };

  return {
    ...navigation,
    pagination,
    isMoreOpen,
    toggleMore,
    goDelete,
    handleCloseMore,
  };
};
