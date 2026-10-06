import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MOCK_CUSTOMERS } from "../../fixture/master-customer";

import type {
  CustomerData,
  MasterCustomerContainerState,
  MasterCustomerNavigation,
  MasterCustomerPagination,
} from "./MasterCustomer.type";

/**
 * Hook for master customer navigation
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
  const goEdit = (customer: CustomerData): void => {
    navigate(`/master-customer/edit/${customer.id}`);
  };

  /**
   * Navigate to detail page
   * @param {CustomerData} customer - The customer data
   * @returns {void}
   */
  const goDetail = (customer: CustomerData): void => {
    navigate(`/master-customer/detail/${customer.id}`);
  };

  return {
    goBack,
    goCreate,
    goEdit,
    goDetail,
  };
};

/**
 * Hook for master customer pagination
 * @returns {MasterCustomerPagination} Pagination state and handlers
 */
export const useMasterCustomerPagination = (): MasterCustomerPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalCount = MOCK_CUSTOMERS.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = MOCK_CUSTOMERS.slice(startIndex, endIndex);

  /**
   * Handle page change
   * @param {number} page - The new page number
   * @returns {void}
   */
  const goToPage = (page: number): void => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  /** 
   * Handle next page
   * @returns {void}
   */
  const nextPage = (): void => goToPage(currentPage + 1);

  /** 
   * Handle prev page
   * @returns {void}
   */
  const prevPage = (): void => goToPage(currentPage - 1);

  /**
   * Handle page size change
   * @param {number} size - The new page size
   * @returns {void}
   */
  const changePageSize = (size: number): void => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    pageSize,
    paginatedData,
    totalCount,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
  };
};

/**
 * Hook for master customer container state
 * @returns {MasterCustomerContainerState} Container state and handlers
 */
export const useMasterCustomerContainerState =
  (): MasterCustomerContainerState => {
    const pagination = useMasterCustomerPagination();
    const [isMoreOpen, setIsMoreOpen] = useState(false);

    /** 
     * Toggle more menu
     * @returns {void}
     */
    const toggleMore = (): void => setIsMoreOpen((prev) => !prev);

    /** 
     * Close more menu
     * @returns {void}
     */
    const handleCloseMore = (): void => setIsMoreOpen(false);

    /** 
     * Handle delete action
     * @returns {void}
     */
    const goDelete = (): void => {
      // Delete action
      handleCloseMore();
    };

    return {
      pagination,
      isMoreOpen,
      toggleMore,
      handleCloseMore,
      goDelete,
    };
  };
