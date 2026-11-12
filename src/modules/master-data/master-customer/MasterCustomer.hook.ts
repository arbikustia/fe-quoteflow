import type { ChangeEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MASTER_CUSTOMER_CONFIG, MASTER_CUSTOMER_ROUTE } from "./MasterCustomer.config";
import type {
  CustomerData,
  CustomerListPaging,
  CustomerListParams,
  CustomerNavigation,
  MasterCustomerController,
} from "./MasterCustomer.type";

/**
 * Manage page, page size and search term of the customer list.
 * @returns {CustomerListPaging} - Query params, paging state and handlers
 */
const useCustomerListPaging = (): CustomerListPaging => {
  const [currentPage, setCurrentPage] = useState<number>(MASTER_CUSTOMER_CONFIG.DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(MASTER_CUSTOMER_CONFIG.DEFAULT_PAGE_SIZE);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const queryParams = useMemo(
    (): CustomerListParams => ({ pageNumber: currentPage, pageSize, searchTerm }),
    [currentPage, pageSize, searchTerm],
  );

  /**
   * Go to the given page, never below the first page.
   * @param {number} page - Requested page
   * @returns {void}
   */
  const handlePageChange = useCallback((page: number): void => {
    setCurrentPage(Math.max(MASTER_CUSTOMER_CONFIG.DEFAULT_PAGE, page));
  }, []);

  /**
   * Change page size and return to the first page.
   * @param {number} size - New page size
   * @returns {void}
   */
  const handlePageSizeChange = useCallback((size: number): void => {
    setPageSize(size);
    setCurrentPage(MASTER_CUSTOMER_CONFIG.DEFAULT_PAGE);
  }, []);

  /**
   * Update the search term and return to the first page.
   * @param {ChangeEvent<HTMLInputElement>} event - Search input change event
   * @returns {void}
   */
  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
    setCurrentPage(MASTER_CUSTOMER_CONFIG.DEFAULT_PAGE);
  }, []);

  return { queryParams, currentPage, pageSize, handlePageChange, handlePageSizeChange, handleSearchChange };
};

/**
 * Create the navigation handlers of the customer list.
 * @returns {CustomerNavigation} - Back, create and edit handlers
 */
const useCustomerNavigation = (): CustomerNavigation => {
  const navigate = useNavigate();

  /**
   * Navigate back to the master data menu.
   * @returns {void}
   */
  const handleBack = useCallback((): void => {
    navigate(MASTER_CUSTOMER_ROUTE.MASTER_MAIN);
  }, [navigate]);

  /**
   * Navigate to the create customer page.
   * @returns {void}
   */
  const handleCreate = useCallback((): void => {
    navigate(MASTER_CUSTOMER_ROUTE.CREATE);
  }, [navigate]);

  /**
   * Navigate to the edit page of a customer.
   * @param {CustomerData} customer - Customer to edit
   * @returns {void}
   */
  const handleEdit = useCallback((customer: CustomerData): void => {
    navigate(`${MASTER_CUSTOMER_ROUTE.EDIT}/${customer.id}`);
  }, [navigate]);

  return { handleBack, handleCreate, handleEdit };
};

/**
 * Manage customer list paging, search and navigation.
 * @returns {MasterCustomerController} - List query params, state and handlers
 */
export const useMasterCustomer = (): MasterCustomerController => ({
  ...useCustomerListPaging(),
  ...useCustomerNavigation(),
});
