/* eslint-disable jsdoc/require-jsdoc */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { _mapVoucher, useCreateVoucherMutation, useGetVouchersQuery } from "./MasterVoucher.api";
import type {
  MasterVoucherContainerState,
  MasterVoucherNavigation,
  MasterVoucherPagination,
  VoucherData,
  VoucherListApiState,
  VoucherListResponse,
} from "./MasterVoucher.type";

/**
 * Provide master voucher navigation.
 * @returns {MasterVoucherNavigation} Navigation handlers
 */
export const useMasterVoucherNavigation = (): MasterVoucherNavigation => {
  const navigate = useNavigate();

  const goBack = (): void => { navigate(-1); };
  const goCreate = (): void => { navigate("/master-voucher/create"); };
  const goEdit = (voucher: VoucherData): void => { navigate(`/master-voucher/edit/${voucher.id}`); };
  const goDetail = (voucher: VoucherData): void => { navigate(`/master-voucher/detail/${voucher.id}`); };

  return { goBack, goCreate, goEdit, goDetail };
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
    const message = typeof response.messages === "string" ? response.messages : "Unable to load vouchers.";

    return { isLoading: false, errorMessage: message, isMissingData: false, paginatedData: [], totalPages: 0, totalCount: 0, hasNext: false, hasPrevious: false };
  }

  return {
    isLoading: false,
    errorMessage: null,
    isMissingData: false,
    paginatedData: response.data.data.map(_mapVoucher),
    totalPages: response.data.total_pages,
    totalCount: response.data.total_count,
    hasNext: response.data.has_next,
    hasPrevious: response.data.has_previous,
  };
};

/**
 * Provide voucher creation mutation.
 * @returns {ReturnType<typeof useCreateVoucherMutation>} Voucher mutation state
 */
export const useMasterVoucherCreate = (): ReturnType<typeof useCreateVoucherMutation> => useCreateVoucherMutation();

/**
 * Provide API-backed voucher pagination.
 * @returns {MasterVoucherPagination} Voucher pagination state
 */
export const useMasterVoucherPagination = (): MasterVoucherPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const queryResult = useGetVouchersQuery({ pageNumber: currentPage, pageSize, searchTerm: "" });
  const derived = _deriveVoucherListState(queryResult);

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
 * Provide complete master voucher container state.
 * @returns {MasterVoucherContainerState} Container state
 */
export const useMasterVoucherContainerState = (): MasterVoucherContainerState => {
  const navigation = useMasterVoucherNavigation();
  const pagination = useMasterVoucherPagination();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const toggleMore = (): void => { setIsMoreOpen((previous) => !previous); };
  const handleCloseMore = (): void => { setIsMoreOpen(false); };
  const goDelete = (): void => { handleCloseMore(); };

  return { ...navigation, pagination, isMoreOpen, toggleMore, goDelete, handleCloseMore };
};
