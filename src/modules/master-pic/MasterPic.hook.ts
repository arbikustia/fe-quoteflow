/* eslint-disable jsdoc/require-returns, jsdoc/require-param-type, jsdoc/require-param-description */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { _mapPic, useGetPicsQuery } from "./MasterPic.api";
import type {
  MasterPicContainerState,
  MasterPicNavigation,
  MasterPicPagination,
  PicData,
  PicListApiState,
  PicListResponse,
} from "./MasterPic.type";

/**
 * Hook for master PIC navigation.
 * @returns {MasterPicNavigation} Navigation functions
 */
export const useMasterPicNavigation = (): MasterPicNavigation => {
  const navigate = useNavigate();
  /**
   *
   */
  const goBack = (): void => { navigate(-1); };
  /**
   *
   */
  const goCreate = (): void => { navigate("/master-pic/create"); };
  /**
   *
   * @param pic
   */
  const goEdit = (pic: PicData): void => { navigate(`/master-pic/edit/${pic.id}`); };
  /**
   *
   * @param pic
   */
  const goDetail = (pic: PicData): void => { navigate(`/master-pic/detail/${pic.id}`); };

  return { goBack, goCreate, goEdit, goDetail };
};

/**
 * Derive list state from API query result.
 * @param {ReturnType<typeof useGetPicsQuery>} queryResult - RTK Query result
 * @returns {PicListApiState} Derived state
 */
const _derivePicListState = (queryResult: ReturnType<typeof useGetPicsQuery>): PicListApiState => {
  const { data, error, isLoading } = queryResult;

  if (isLoading) return { isLoading: true, errorMessage: null, isMissingData: false, paginatedData: [], totalPages: 0, totalCount: 0 };

  if (error) return { isLoading: false, errorMessage: "Unable to load PICs.", isMissingData: false, paginatedData: [], totalPages: 0, totalCount: 0 };

  const response: PicListResponse | undefined = data;

  if (!response) return { isLoading: false, errorMessage: "No response received from server.", isMissingData: true, paginatedData: [], totalPages: 0, totalCount: 0 };

  return {
    isLoading: false,
    errorMessage: null,
    isMissingData: false,
    paginatedData: response.data.map(_mapPic),
    totalPages: response.total_pages,
    totalCount: response.total_count,
  };
};

/**
 * Hook for API-backed PIC pagination.
 * @returns {MasterPicPagination} PIC pagination state and handlers
 */
export const useMasterPicPagination = (): MasterPicPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const queryResult = useGetPicsQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const derived = _derivePicListState(queryResult);
  /**
   *
   * @param page
   */
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, derived.totalPages)));
  /**
   *
   */
  const nextPage = (): void => { if (!derived.isLoading && !derived.errorMessage && queryResult.data?.has_next) goToPage(currentPage + 1); };
  /**
   *
   */
  const prevPage = (): void => { if (!derived.isLoading && !derived.errorMessage && queryResult.data?.has_previous) goToPage(currentPage - 1); };
  /**
   *
   * @param size
   */
  const changePageSize = (size: number): void => { setPageSize(size); setCurrentPage(1); };
  /**
   *
   * @param value
   */
  const handleSearchTerm = (value: string): void => { setSearchTerm(value); setCurrentPage(1); };

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
    setSearchTerm: handleSearchTerm,
  };
};

/**
 * Hook for master PIC container state.
 * @returns {MasterPicContainerState} Container state and handlers
 */
export const useMasterPicContainerState = (): MasterPicContainerState => {
  const pagination = useMasterPicPagination();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  /**
   *
   */
  const toggleMore = (): void => setIsMoreOpen((previous) => !previous);
  /**
   *
   */
  const goDelete = (): void => setIsMoreOpen(false);
  /**
   *
   */
  const handleCloseMore = (): void => setIsMoreOpen(false);

  return { pagination, isMoreOpen, toggleMore, goDelete, handleCloseMore };
};
