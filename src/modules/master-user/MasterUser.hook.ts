import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { mapUser, useGetUsersQuery } from "@/services/master-user.service";

import type { MasterUserContainerState, MasterUserNavigation, MasterUserPagination, UserData } from "./MasterUser.type";

// Deprecated: modal state moved to page pattern. Kept as stub for backwards compat.
/**
 * Hook for master user state
 * @returns {Record<string, never>} state
 */
export const useMasterUserState = (): Record<string, never> => ({});

/**
 * Navigation hook
 * @returns {MasterUserNavigation} navigation state
 */
export const useMasterUserNavigation = (): MasterUserNavigation => {
  const navigate = useNavigate();

  /**
   * Navigate back
   * @returns {void} void
   */
  const goBack = (): void => {
    navigate(-1);
  };

  /**
   * Navigate to create
   * @returns {void} void
   */
  const goCreate = (): void => {
    navigate("/master-user/create");
  };

  /**
   * Navigate to edit
   * @param {UserData} c - user data
   * @returns {void} void
   */
  const goEdit = (c: UserData): void => {
    navigate(`/master-user/edit/${c.id}`, { state: { user: c } });
  };

  /**
   * Navigate to detail
   * @param {UserData} c - user data
   * @returns {void} void
   */
  const goDetail = (c: UserData): void => {
    navigate(`/master-user/detail/${c.id}`);
  };

  return { goBack, goCreate, goEdit, goDetail };
};

/**
 * Container state hook
 * @returns {MasterUserContainerState} container state
 */
export const useMasterUserContainerState = (): MasterUserContainerState => {
  const navigation = useMasterUserNavigation();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError } = useGetUsersQuery({
    PageNumber: currentPage,
    PageSize: pageSize,
    SearchTerm: searchTerm || undefined,
  });

  const paginatedData = data?.data.map(mapUser) ?? [];
  const totalCount = data?.total_count ?? 0;
  const totalPages = Math.max(1, data?.total_pages ?? 1);

  const goToPage = (page: number): void => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const changePageSize = (size: number): void => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const nextPage = (): void => {
    goToPage(currentPage + 1);
  };

  const prevPage = (): void => {
    goToPage(currentPage - 1);
  };

  const handleSearchTerm = (value: string): void => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const pagination: MasterUserPagination = {
    currentPage,
    totalPages,
    pageSize,
    paginatedData,
    totalCount,
    isEmpty: !isLoading && paginatedData.length === 0,
    isLoading,
    isError,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    setSearchTerm: handleSearchTerm,
  };

  const [isMoreOpen, setIsMoreOpen] = useState(false);

  /**
   * Toggle more
   * @returns {void} void
   */
  const toggleMore = (): void => {
    setIsMoreOpen(!isMoreOpen);
  };

  /**
   * Handle delete
   * @returns {void} void
   */
  const goDelete = (): void => {
    setIsMoreOpen(false);
  };

  /**
   * Close more menu
   * @returns {void} void
   */
  const handleCloseMore = (): void => {
    setIsMoreOpen(false);
  };

  return {
    ...navigation,
    pagination,
    isMoreOpen,
    toggleMore,
    goDelete,
    handleCloseMore,
  };
};
