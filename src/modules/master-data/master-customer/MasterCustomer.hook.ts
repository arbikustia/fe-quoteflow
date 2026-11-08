import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type {
  CustomerData,
  CustomerListApiState,
  MasterCustomerNavigation,
  MasterCustomerPagination,
} from "./MasterCustomer.type";

import {
  mapCustomer,
  useGetCustomersQuery,
} from "@/services/master-customer.service";

/**
 * Hook for master customer navigation.
 *
 * @returns {MasterCustomerNavigation} Navigation functions
 */
export const useMasterCustomerNavigation = (): MasterCustomerNavigation => {
  const navigate = useNavigate();

    /**
   * Navigate back
   *
   * @returns {void}
   */
  const goBack = (): void => {
    navigate("/master-main");
  };

    /**
   * Navigate to create page
   *
   * @returns {void}
   */
  const goCreate = (): void => {
    navigate("/master-customer/create");
  };
    /**
   * Navigate to edit page
   *
   * @param {CustomerData} customer - The customer data
   * @returns {void}
   */
  const goEdit = (customer: CustomerData): void => {
    navigate(`/master-customer/edit/${customer.id}`, { state: { customer } });
  };

  return { goBack, goCreate, goEdit };
};

/**
 * Create customer list state without paginated data.
 *
 * @param {boolean} isLoading - Whether customer data is loading
 * @param {boolean} isMissingData - Whether API response data is missing
 * @param {string} [errorMessage] - Customer list error message
 * @returns {CustomerListApiState} Empty customer list state
 */
const _createCustomerListState = (
  isLoading: boolean,
  isMissingData: boolean,
  errorMessage?: string,
): CustomerListApiState => ({
  isLoading,
  errorMessage,
  isMissingData,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Derive paginated state from API response envelope.
 * Handles loading, HTTP error, envelope status false, missing data explicitly.
 *
 * @param {ReturnType<typeof useGetCustomersQuery>} queryResult - RTK Query result
 * @returns {CustomerListApiState} Derived state
 */
const _deriveCustomerListState = (
  queryResult: ReturnType<typeof useGetCustomersQuery>,
): CustomerListApiState => {
  const { data, error, isLoading } = queryResult;

  if (isLoading) {
    return _createCustomerListState(true, false);
  }

  if (error) {
    return _createCustomerListState(false, false, "Unable to load customers.");
  }

  const response = data;

  if (!response?.data) {
    return _createCustomerListState(false, true, "Response is missing data.");
  }

  return {
    isLoading: false,
    isMissingData: false,
    paginatedData: response.data.map(mapCustomer),
    totalPages: response.total_pages,
    totalCount: response.total_count,
  };
};

/**
 * Build pagination handlers bound to the current state.
 *
 * @param {number} totalPages - Total available pages
 * @param {(page: number) => void} setPage - Page setter
 * @param {(size: number) => void} setSize - Page size setter
 * @param {(term: string) => void} setTerm - Search term setter
 * @returns {{ goToPage: (page: number) => void; changePageSize: (size: number) => void; handleSearchTerm: (value: string) => void }} Pagination handlers
 */
const _buildPaginationHandlers = (
  totalPages: number,
  setPage: (page: number) => void,
  setSize: (size: number) => void,
  setTerm: (term: string) => void,
): { goToPage: (page: number) => void; changePageSize: (size: number) => void; handleSearchTerm: (value: string) => void } => {
  /**
   * Handle page change.
   *
   * @param {number} page - The new page number
   * @returns {void}
   */
  const goToPage = (page: number): void => setPage(Math.max(1, Math.min(page, totalPages)));

  /**
   * Handle page size change.
   *
   * @param {number} size - The new page size
   * @returns {void}
   */
  const changePageSize = (size: number): void => {
    setSize(size);
    setPage(1);
  };

  /**
   * Handle search term change.
   *
   * @param {string} value - The search term
   * @returns {void}
   */
  const handleSearchTerm = (value: string): void => {
    setTerm(value);
    setPage(1);
  };

  return { goToPage, changePageSize, handleSearchTerm };
};

/**
 * Hook for API-backed master customer pagination.
 *
 * @returns {MasterCustomerPagination} Customer pagination state and handlers
 */
export const useMasterCustomerPagination = (): MasterCustomerPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const queryResult = useGetCustomersQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const derived = _deriveCustomerListState(queryResult);
  const handlers = _buildPaginationHandlers(derived.totalPages, setCurrentPage, setPageSize, setSearchTerm);

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
    changePageSize: handlers.changePageSize,
    setSearchTerm: handlers.handleSearchTerm,
  };
};
