import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type {
  CustomerData,
  CustomerListApiState,
  CustomerListResponse,
  MasterCustomerContainerState,
  MasterCustomerNavigation,
  MasterCustomerPagination,
} from "./MasterCustomer.type";

import { mapCustomer, useGetCustomersQuery } from "@/services/master-customer.service";

/**
 * Hook for master customer navigation.
 * @returns {MasterCustomerNavigation} Navigation functions
 */
export const useMasterCustomerNavigation = (): MasterCustomerNavigation => {
  const navigate = useNavigate();

  /**
   * Navigate back
   * @returns {void}
   */
  const goBack = (): void => { navigate(-1); };

  /**
   * Navigate to create page
   * @returns {void}
   */
  const goCreate = (): void => { navigate("/master-customer/create"); };
  /**
   * Navigate to edit page
   * @param {CustomerData} customer - The customer data
   * @returns {void}
   */
  const goEdit = (customer: CustomerData): void => { navigate(`/master-customer/edit/${customer.id}`); };
  /**
   * Navigate to detail page
   * @param {CustomerData} customer - The customer data
   * @returns {void}
   */
  const goDetail = (customer: CustomerData): void => { navigate(`/master-customer/detail/${customer.id}`); };

  return { goBack, goCreate, goEdit, goDetail };
};

/**
 * Derive paginated state from API response envelope.
 * Handles loading, HTTP error, envelope status false, missing data explicitly.
 * @param {ReturnType<typeof useGetCustomersQuery>} queryResult - RTK Query result
 * @returns {CustomerListApiState} Derived state
 */
const _deriveCustomerListState = (queryResult: ReturnType<typeof useGetCustomersQuery>): CustomerListApiState => {
  const { data, error, isLoading } = queryResult;

  if (isLoading) {
    return _createLoadingState();
  }

  if (error) {
    return _createErrorState();
  }

  const response: CustomerListResponse | undefined = data;

  if (!response) {
    return _createMissingResponseState();
  }

  const customerList = response.data;

  if (!customerList) {
    return _createMissingPayloadState();
  }

  const customers = customerList.map(mapCustomer);

  return _createSuccessState(customers, response.total_pages, response.total_count);
};

/**
 * Create loading state.
 * @returns {CustomerListApiState} Loading state
 */
const _createLoadingState = (): CustomerListApiState => ({
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
 * @returns {CustomerListApiState} Error state
 */
const _createErrorState = (): CustomerListApiState => ({
  isLoading: false,
  errorMessage: "Unable to load customers.",
  isEnvelopeError: false,
  isMissingData: false,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Create missing response state.
 * @returns {CustomerListApiState} Missing response state
 */
const _createMissingResponseState = (): CustomerListApiState => ({
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
 * @returns {CustomerListApiState} Missing payload state
 */
const _createMissingPayloadState = (): CustomerListApiState => ({
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
 * @param {CustomerData[]} customers - Mapped customer data
 * @param {number} totalPages - Total pages from API
 * @param {number} totalCount - Total count from API
 * @returns {CustomerListApiState} Success state
 */
const _createSuccessState = (customers: CustomerData[], totalPages: number, totalCount: number): CustomerListApiState => ({
  isLoading: false,
  errorMessage: null,
  isEnvelopeError: false,
  isMissingData: false,
  paginatedData: customers,
  totalPages,
  totalCount,
});

/**
 * Hook for API-backed master customer pagination.
 * @returns {MasterCustomerPagination} Customer pagination state and handlers
 */
export const useMasterCustomerPagination = (): MasterCustomerPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Fetch customers with current pagination and search
   */
  const queryResult = useGetCustomersQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const derived = _deriveCustomerListState(queryResult);

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
  const nextPage = (): void => { if (!derived.isLoading && !derived.errorMessage && derived.paginatedData.length > 0 && queryResult.data?.has_next) goToPage(currentPage + 1); };
  /**
   * Handle prev page
   * @returns {void}
   */
  const prevPage = (): void => { if (!derived.isLoading && !derived.errorMessage && derived.paginatedData.length > 0 && queryResult.data?.has_previous) goToPage(currentPage - 1); };
  /**
   * Handle page size change
   * @param {number} size - The new page size
   * @returns {void}
   */
  const changePageSize = (size: number): void => { setPageSize(size); setCurrentPage(1); };
  /**
   * Handle search term change
   * @param {string} value - The search term
   * @returns {void}
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
 * Hook for master customer container state.
 * @returns {MasterCustomerContainerState} Container state and handlers
 */
export const useMasterCustomerContainerState = (): MasterCustomerContainerState => {
  const pagination = useMasterCustomerPagination();
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
