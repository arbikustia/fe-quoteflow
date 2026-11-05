import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type {
  CustomerData,
  CustomerListApiState,
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
  const goBack = (): void => { navigate("/master-main"); };

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
  const goEdit = (customer: CustomerData): void => {
    navigate(`/master-customer/edit/${customer.id}`, { state: { customer } });
  };

  return { goBack, goCreate, goEdit };
};

/**
 * Create customer list state without paginated data.
 * @param {boolean} isLoading - Whether customer data is loading
 * @param {boolean} isMissingData - Whether API response data is missing
 * @param {string} [errorMessage] - Customer list error message
 * @returns {CustomerListApiState} Empty customer list state
 */
const _createCustomerListState = (isLoading: boolean, isMissingData: boolean, errorMessage?: string): CustomerListApiState => ({
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
 * @param {ReturnType<typeof useGetCustomersQuery>} queryResult - RTK Query result
 * @returns {CustomerListApiState} Derived state
 */
const _deriveCustomerListState = (queryResult: ReturnType<typeof useGetCustomersQuery>): CustomerListApiState => {
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
    changePageSize,
    setSearchTerm: handleSearchTerm,
  };
};
