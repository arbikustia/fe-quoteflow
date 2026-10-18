import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createPaginationHandlers } from "@/utils/pagination.helpers";

import type {
  MasterUserContainerState,
  MasterUserNavigation,
  MasterUserPagination,
  UserData,
} from "./MasterUser.type";

import { mapUser, useGetUsersQuery } from "@/services/master-user.service";


/**
 * Navigation hook.
 * @returns {MasterUserNavigation} Navigation state
 */
export const useMasterUserNavigation = (): MasterUserNavigation => {
  const navigate = useNavigate();

  /** Navigate back. */
  const goBack = (): void => {
    navigate(-1);
  };

  /** Navigate to create. */
  const goCreate = (): void => {
    navigate("/master-user/create");
  };

  /**
   * Navigate to edit.
   * @param {UserData} c - User data
   */
  const goEdit = (c: UserData): void => {
    navigate(`/master-user/edit/${c.id}`, { state: { user: c } });
  };

  /**
   * Navigate to detail.
   * @param {UserData} c - User data
   */
  const goDetail = (c: UserData): void => {
    navigate(`/master-user/detail/${c.id}`);
  };

  return { goBack, goCreate, goEdit, goDetail };
};

/**
 * Build user pagination data.
 * @param {number} currentPage - Current page
 * @param {number} pageSize - Items per page
 * @param {string} searchTerm - Search term
 * @returns {Pick<MasterUserPagination, "currentPage" | "pageSize" | "paginatedData" | "totalCount" | "totalPages" | "isLoading" | "isError" | "isEmpty">} User pagination data
 */
const useUserPaginationData = (currentPage: number, pageSize: number, searchTerm: string): Pick<MasterUserPagination, "currentPage" | "pageSize" | "paginatedData" | "totalCount" | "totalPages" | "isLoading" | "isError" | "isEmpty"> => {
  const { data, isLoading, isError } = useGetUsersQuery({ PageNumber: currentPage, PageSize: pageSize, SearchTerm: searchTerm || undefined });
  const paginatedData = data?.data.map(mapUser) ?? [];
  const totalCount = data?.total_count ?? 0;
  const totalPages = Math.max(1, data?.total_pages ?? 1);

  return { currentPage, pageSize, paginatedData, totalCount, totalPages, isLoading, isError, isEmpty: !isLoading && paginatedData.length === 0 };
};

/**
 * Manage pagination state for user list.
 * @returns {MasterUserPagination} User pagination state
 */
export const useMasterUserPagination = (): MasterUserPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const pagination = useUserPaginationData(currentPage, pageSize, searchTerm);
  const handlers = createPaginationHandlers({
    currentPage, totalPages: pagination.totalPages, hasNext: currentPage < pagination.totalPages,
    hasPrevious: currentPage > 1, canPaginate: !pagination.isLoading && !pagination.isError && pagination.paginatedData.length > 0,
    setCurrentPage, setPageSize, setSearchTerm,
  });

  return { ...pagination, goToPage: handlers.goToPage, nextPage: handlers.nextPage, prevPage: handlers.prevPage, changePageSize: handlers.changePageSize, setSearchTerm: handlers.handleSearchTerm };
};

/**
 * Container state hook.
 * @returns {MasterUserContainerState} Container state
 */
export const useMasterUserContainerState = (): MasterUserContainerState => {
  const navigation = useMasterUserNavigation();
  const pagination = useMasterUserPagination();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  /** Toggle more menu. */
  const toggleMore = (): void => {
    setIsMoreOpen((previous) => !previous);
  };

  /** Handle delete. */
  const goDelete = (): void => {
    setIsMoreOpen(false);
  };

  /** Close more menu. */
  const handleCloseMore = (): void => {
    setIsMoreOpen(false);
  };

  return { ...navigation, pagination, isMoreOpen, toggleMore, goDelete, handleCloseMore };
};
