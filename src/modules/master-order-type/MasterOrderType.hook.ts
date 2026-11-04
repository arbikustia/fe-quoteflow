import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { mapOrderType, useGetOrderTypesQuery } from "@/services/master-order-type.service";

import type {
  MasterOrderTypeContainerState,
  MasterOrderTypeNavigation,
  MasterOrderTypePagination,
  OrderTypeData,
  OrderTypeListApiState,
  OrderTypeListResponse,
} from "./MasterOrderType.type";

/**
 * Hook for master order type navigation.
 * @returns {MasterOrderTypeNavigation} Navigation functions
 */
export const useMasterOrderTypeNavigation = (): MasterOrderTypeNavigation => {
  const navigate = useNavigate();

  /**
   * Navigate back
   * @returns {void}
   */
  const goBack = (): void => {
    navigate("/master-main");
  };

  /**
   * Navigate to create page
   * @returns {void}
   */
  const goCreate = (): void => {
    navigate("/master-order-type/create");
  };

  /**
   * Navigate to edit page
   * @param {OrderTypeData} orderType - The order type data
   * @returns {void}
   */
  const goEdit = (orderType: OrderTypeData): void => {
    navigate(`/master-order-type/edit/${orderType.id}`, { state: { orderType } });
  };

  return { goBack, goCreate, goEdit };
};

/**
 * Create loading state.
 * @returns {OrderTypeListApiState} Loading state
 */
const _createLoadingState = (): OrderTypeListApiState => ({
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
 * @returns {OrderTypeListApiState} Error state
 */
const _createErrorState = (): OrderTypeListApiState => ({
  isLoading: false,
  errorMessage: "Unable to load order types.",
  isEnvelopeError: false,
  isMissingData: false,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create missing response state.
 * @returns {OrderTypeListApiState} Missing response state
 */
const _createMissingResponseState = (): OrderTypeListApiState => ({
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
 * @returns {OrderTypeListApiState} Missing payload state
 */
const _createMissingPayloadState = (): OrderTypeListApiState => ({
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
 * @param {OrderTypeData[]} orderTypes - Mapped order type data
 * @param {number} totalPages - Total pages from API
 * @param {number} totalCount - Total count from API
 * @returns {OrderTypeListApiState} Success state
 */
const _createSuccessState = (
  orderTypes: OrderTypeData[],
  totalPages: number,
  totalCount: number,
): OrderTypeListApiState => ({
  isLoading: false,
  errorMessage: null,
  isEnvelopeError: false,
  isMissingData: false,
  paginatedData: orderTypes,
  totalPages,
  totalCount,
});

/**
 * Derive paginated state from API response envelope.
 * @param {ReturnType<typeof useGetOrderTypesQuery>} queryResult - RTK Query result
 * @returns {OrderTypeListApiState} Derived state
 */
const _deriveOrderTypeListState = (queryResult: ReturnType<typeof useGetOrderTypesQuery>): OrderTypeListApiState => {
  const { data, error, isLoading } = queryResult;

  if (isLoading) {
    return _createLoadingState();
  }

  if (error) {
    return _createErrorState();
  }

  const response: OrderTypeListResponse | undefined = data;

  if (!response) {
    return _createMissingResponseState();
  }

  const orderTypeList = response.data;

  if (!orderTypeList) {
    return _createMissingPayloadState();
  }

  const orderTypes = orderTypeList.map(mapOrderType);

  return _createSuccessState(orderTypes, response.total_pages, response.total_count);
};

/**
 * Hook for API-backed master order type pagination.
 * @returns {MasterOrderTypePagination} Order type pagination state and handlers
 */
export const useMasterOrderTypePagination = (): MasterOrderTypePagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const queryResult = useGetOrderTypesQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const derived = _deriveOrderTypeListState(queryResult);

  /**
   * Handle page change
   * @param {number} page - The new page number
   * @returns {void}
   */
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, derived.totalPages)));

  /**
   * Handle next page
   * @returns {void}
   */
  const nextPage = (): void => {
    if (!derived.isLoading && !derived.errorMessage && derived.paginatedData.length > 0 && queryResult.data?.has_next) {
      goToPage(currentPage + 1);
    }
  };

  /**
   * Handle prev page
   * @returns {void}
   */
  const prevPage = (): void => {
    if (!derived.isLoading && !derived.errorMessage && derived.paginatedData.length > 0 && queryResult.data?.has_previous) {
      goToPage(currentPage - 1);
    }
  };

  /**
   * Handle page size change
   * @param {number} size - The new page size
   * @returns {void}
   */
  const changePageSize = (size: number): void => {
    setPageSize(size);
    setCurrentPage(1);
  };

  /**
   * Handle search term change
   * @param {string} value - The search term
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

/**
 * Hook for master order type container state.
 * @returns {MasterOrderTypeContainerState} Container state and handlers
 */
export const useMasterOrderTypeContainerState = (): MasterOrderTypeContainerState => {
  const pagination = useMasterOrderTypePagination();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  /**
   * Toggle more menu
   * @returns {void}
   */
  const toggleMore = (): void => setIsMoreOpen((previous) => !previous);

  /**
   * Close more menu
   * @returns {void}
   */
  const handleCloseMore = (): void => setIsMoreOpen(false);

  /**
   * Handle delete action
   * @returns {void}
   */
  const goDelete = (): void => handleCloseMore();

  return { pagination, isMoreOpen, toggleMore, handleCloseMore, goDelete };
};
