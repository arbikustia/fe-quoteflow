import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createPaginationHandlers } from "@/utils/pagination.helpers";

import type {
  MasterPicContainerState,
  MasterPicNavigation,
  MasterPicPagination,
  PicData,
} from "./MasterPic.type";

import { mapPic, useGetPicsQuery } from "@/services/master-pic.service";

/**
 * Hook for master PIC navigation.
 * @returns {MasterPicNavigation} Navigation handlers
 */
export const useMasterPicNavigation = (): MasterPicNavigation => {
  const navigate = useNavigate();

  /** Navigate back. */
  const goBack = (): void => {
    navigate(-1);
  };

  /** Navigate to create PIC. */
  const goCreate = (): void => {
    navigate("/master-pic/create");
  };

  /**
   * Navigate to edit PIC.
   * @param {PicData} pic - PIC record
   */
  const goEdit = (pic: PicData): void => {
    navigate(`/master-pic/edit/${pic.id}`, { state: { pic } });
  };

  /**
   * Navigate to detail PIC.
   * @param {PicData} pic - PIC record
   */
  const goDetail = (pic: PicData): void => {
    navigate(`/master-pic/detail/${pic.id}`);
  };

  return { goBack, goCreate, goEdit, goDetail };
};

/**
 * Load PIC pagination data.
 * @param {number} currentPage - Current page
 * @param {number} pageSize - Page size
 * @param {string} searchTerm - Search keyword
 * @returns {Pick<MasterPicPagination, "currentPage" | "pageSize" | "paginatedData" | "totalCount" | "totalPages" | "isLoading" | "isError" | "isEmpty">} Pagination data
 */
const usePicPaginationData = (
  currentPage: number,
  pageSize: number,
  searchTerm: string,
): Pick<MasterPicPagination, "currentPage" | "pageSize" | "paginatedData" | "totalCount" | "totalPages" | "isLoading" | "isError" | "isEmpty"> => {
  const { data, isLoading, isError } = useGetPicsQuery({
    PageNumber: currentPage,
    PageSize: pageSize,
    SearchTerm: searchTerm || undefined,
  });
  const paginatedData = data?.data.map(mapPic) ?? [];
  const totalCount = data?.total_count ?? 0;
  const totalPages = Math.max(1, data?.total_pages ?? 1);

  return {
    currentPage,
    totalPages,
    pageSize,
    paginatedData,
    totalCount,
    isEmpty: !isLoading && paginatedData.length === 0,
    isLoading,
    isError,
  };
};

/**
 * Hook for API PIC search and pagination.
 * @returns {MasterPicPagination} Pagination state
 */
export const useMasterPicPagination = (): MasterPicPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const paginationData = usePicPaginationData(currentPage, pageSize, searchTerm);

  const handlers = createPaginationHandlers({
    currentPage,
    totalPages: paginationData.totalPages,
    hasNext: currentPage < paginationData.totalPages,
    hasPrevious: currentPage > 1,
    canPaginate: !paginationData.isLoading && !paginationData.isError && paginationData.paginatedData.length > 0,
    setCurrentPage,
    setPageSize,
    setSearchTerm,
  });

  return {
    ...paginationData,
    goToPage: handlers.goToPage,
    nextPage: handlers.nextPage,
    prevPage: handlers.prevPage,
    changePageSize: handlers.changePageSize,
    setSearchTerm: handlers.handleSearchTerm,
  };
};

/**
 * Hook for master PIC container state.
 * @returns {MasterPicContainerState} Container state
 */
export const useMasterPicContainerState = (): MasterPicContainerState => {
  const pagination = useMasterPicPagination();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  /** Toggle dropdown menu. */
  const toggleMore = (): void => {
    setIsMoreOpen((previous) => !previous);
  };

  /** Close menu and delete. */
  const goDelete = (): void => {
    setIsMoreOpen(false);
  };

  /** Close dropdown menu. */
  const handleCloseMore = (): void => {
    setIsMoreOpen(false);
  };

  return { pagination, isMoreOpen, toggleMore, goDelete, handleCloseMore };
};
