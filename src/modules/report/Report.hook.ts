import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { mapRentalOrder, useGetRentalOrdersQuery } from "@/services/rental-order.service";

import type {
  RentalOrderListResponse,
  ReportOrderApiState,
  ReportOrderData,
  ReportOrderPagination,
} from "./Report.type";

/**
 * Hook for report order navigation.
 * @returns {{ goBack: () => void; goToDetail: (order: ReportOrderData) => void }} Navigation functions
 */
export const useReportOrderNavigation = (): { goBack: () => void; goToDetail: (order: ReportOrderData) => void } => {
  const navigate = useNavigate();

  /**
   * Navigate back.
   * @returns {void}
   */
  const goBack = (): void => { navigate(-1); };

  /**
   * Navigate to order detail page.
   * @param {ReportOrderData} order - Report order
   * @returns {void}
   */
  const goToDetail = (order: ReportOrderData): void => {
    if (order.transactionId) {
      navigate(`/order/detail/${order.transactionId}`);
    }
  };

  return { goBack, goToDetail };
};

/**
 * Create loading state.
 * @returns {ReportOrderApiState} Loading state
 */
const _createLoadingState = (): ReportOrderApiState => ({
  isLoading: true,
  errorMessage: null,
  isEnvelopeError: false,
  isMissingData: false,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create HTTP error state.
 * @returns {ReportOrderApiState} Error state
 */
const _createErrorState = (): ReportOrderApiState => ({
  isLoading: false,
  errorMessage: "Unable to load orders.",
  isEnvelopeError: false,
  isMissingData: false,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create missing response state.
 * @returns {ReportOrderApiState} Missing response state
 */
const _createMissingResponseState = (): ReportOrderApiState => ({
  isLoading: false,
  errorMessage: "No response received from server.",
  isEnvelopeError: false,
  isMissingData: true,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create missing payload state.
 * @returns {ReportOrderApiState} Missing payload state
 */
const _createMissingPayloadState = (): ReportOrderApiState => ({
  isLoading: false,
  errorMessage: "Response is missing data payload.",
  isEnvelopeError: false,
  isMissingData: true,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create success state.
 * @param {ReportOrderData[]} orders - Mapped order data
 * @param {number} totalPages - Total pages from API
 * @param {number} totalCount - Total count from API
 * @returns {ReportOrderApiState} Success state
 */
const _createSuccessState = (orders: ReportOrderData[], totalPages: number, totalCount: number): ReportOrderApiState => ({
  isLoading: false,
  errorMessage: null,
  isEnvelopeError: false,
  isMissingData: false,
  paginatedData: orders,
  totalPages,
  totalCount,
});

/**
 * Derive paginated state from API response envelope.
 * @param {ReturnType<typeof useGetRentalOrdersQuery>} queryResult - RTK Query result
 * @returns {ReportOrderApiState} Derived state
 */
const _deriveReportOrderListState = (queryResult: ReturnType<typeof useGetRentalOrdersQuery>): ReportOrderApiState => {
  const { data, error, isLoading } = queryResult;

  if (isLoading) return _createLoadingState();

  if (error) return _createErrorState();

  const response: RentalOrderListResponse | undefined = data;

  if (!response) return _createMissingResponseState();

  const orderList = response.data;

  if (!orderList) return _createMissingPayloadState();

  const orders = orderList.map(mapRentalOrder);

  return _createSuccessState(orders, response.total_pages, response.total_count);
};

/**
 * Hook for API-backed report order pagination.
 * @returns {ReportOrderPagination} Report order pagination state and handlers
 */
export const useReportOrderPagination = (): ReportOrderPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const queryResult = useGetRentalOrdersQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const derived = _deriveReportOrderListState(queryResult);

  /**
   * Handle page change.
   * @param {number} page - New page number
   * @returns {void}
   */
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, derived.totalPages)));

  /**
   * Handle next page.
   * @returns {void}
   */
  const nextPage = (): void => {
    if (!derived.isLoading && !derived.errorMessage && derived.paginatedData.length > 0 && queryResult.data?.has_next) {
      goToPage(currentPage + 1);
    }
  };

  /**
   * Handle prev page.
   * @returns {void}
   */
  const prevPage = (): void => {
    if (!derived.isLoading && !derived.errorMessage && derived.paginatedData.length > 0 && queryResult.data?.has_previous) {
      goToPage(currentPage - 1);
    }
  };

  /**
   * Handle page size change.
   * @param {number} size - New page size
   * @returns {void}
   */
  const changePageSize = (size: number): void => {
    setPageSize(size);
    setCurrentPage(1);
  };

  /**
   * Handle search term change.
   * @param {string} value - Search term
   * @returns {void}
   */
  const handleSearchTerm = (value: string): void => {
    setSearchTerm(value);
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
    setSearchTerm: handleSearchTerm,
  };
};
