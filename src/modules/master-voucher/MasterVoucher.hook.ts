import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createPaginationHandlers } from "@/utils/pagination.helpers";

import type {
  MasterVoucherContainerState,
  MasterVoucherNavigation,
  MasterVoucherPagination,
  VoucherData,
  VoucherListApiState,
  VoucherListResponse,
} from "./MasterVoucher.type";

import { mapVoucher, useGetVouchersQuery } from "@/services/master-voucher.service";

/**
 * Provide master voucher navigation.
 * @returns {MasterVoucherNavigation} Navigation handlers
 */
export const useMasterVoucherNavigation = (): MasterVoucherNavigation => {
  const navigate = useNavigate();

  /**
   *
   */
  const goBack = (): void => { navigate(-1); };
  /**
   *
   */
  const goCreate = (): void => { navigate("/master-voucher/create"); };
  /**
   * Navigate to edit voucher page.
   * @param {VoucherData} voucher - Voucher data
   * @returns {void} No return value
   */
  const goEdit = (voucher: VoucherData): void => {
    navigate(`/master-voucher/edit/${voucher.id}`, { state: { voucher } });
  };

  return { goBack, goCreate, goEdit };
};

/**
 * Derive explicit list state from RTK Query result.
 * @param {ReturnType<typeof useGetVouchersQuery>} queryResult - Query result
 * @returns {VoucherListApiState} Derived list state
 */
const _deriveVoucherListState = (
  queryResult: ReturnType<typeof useGetVouchersQuery>,
): VoucherListApiState => {
  const { data, error, isLoading } = queryResult;

  if (isLoading) {
    return { isLoading: true, errorMessage: null, isMissingData: false, paginatedData: [], totalPages: 0, totalCount: 0, hasNext: false, hasPrevious: false };
  }

  if (error) {
    return { isLoading: false, errorMessage: "Unable to load vouchers.", isMissingData: false, paginatedData: [], totalPages: 0, totalCount: 0, hasNext: false, hasPrevious: false };
  }

  const response: VoucherListResponse | undefined = data;

  if (!response || !response.data) {
    return { isLoading: false, errorMessage: "Voucher data is unavailable. Please try again.", isMissingData: true, paginatedData: [], totalPages: 0, totalCount: 0, hasNext: false, hasPrevious: false };
  }

  if (!response.status) {
    const message = Array.isArray(response.messages)
      ? response.messages.join(" ")
      : (response.messages ?? "Unable to load vouchers.");

    return { isLoading: false, errorMessage: message, isMissingData: false, paginatedData: [], totalPages: 0, totalCount: 0, hasNext: false, hasPrevious: false };
  }

  return {
    isLoading: false,
    errorMessage: null,
    isMissingData: false,
    paginatedData: response.data.map(mapVoucher),
    totalPages: response.total_pages,
    totalCount: response.total_count,
    hasNext: response.has_next,
    hasPrevious: response.has_previous,
  };
};

/**
 * Provide API-backed voucher pagination.
 * @returns {MasterVoucherPagination} Voucher pagination state
 */
export const useMasterVoucherPagination = (): MasterVoucherPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const queryResult = useGetVouchersQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const derived = _deriveVoucherListState(queryResult);

  const handlers = createPaginationHandlers({
    currentPage,
    totalPages: derived.totalPages,
    hasNext: derived.hasNext,
    hasPrevious: derived.hasPrevious,
    canPaginate: !derived.isLoading && !derived.errorMessage && derived.paginatedData.length > 0,
    setCurrentPage,
    setPageSize,
    setSearchTerm,
  });

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
    goToPage: handlers.goToPage,
    nextPage: handlers.nextPage,
    prevPage: handlers.prevPage,
    changePageSize: handlers.changePageSize,
    setSearchTerm: handlers.handleSearchTerm,
  };
};

/**
 * Provide complete master voucher container state.
 * @returns {MasterVoucherContainerState} Container state
 */
export const useMasterVoucherContainerState = (): MasterVoucherContainerState => {
  const navigation = useMasterVoucherNavigation();
  const pagination = useMasterVoucherPagination();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  /**
   *
   */
  const toggleMore = (): void => { setIsMoreOpen((previous) => !previous); };
  /**
   *
   */
  const handleCloseMore = (): void => { setIsMoreOpen(false); };
  /**
   *
   */
  const goDelete = (): void => { handleCloseMore(); };

  return { ...navigation, pagination, isMoreOpen, toggleMore, goDelete, handleCloseMore };
};
