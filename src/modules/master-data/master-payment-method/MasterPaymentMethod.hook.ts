import type { ChangeEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MASTER_PAYMENT_METHOD_CONFIG, MASTER_PAYMENT_METHOD_ROUTE } from "./MasterPaymentMethod.config";
import type {
  MasterPaymentMethodController,
  PaymentMethodData,
  PaymentMethodListPaging,
  PaymentMethodListParams,
  PaymentMethodNavigation,
} from "./MasterPaymentMethod.type";

/**
 * Manage page, page size and search term of the payment method list.
 * @returns {PaymentMethodListPaging} - Query params, paging state and handlers
 */
const usePaymentMethodListPaging = (): PaymentMethodListPaging => {
  const [currentPage, setCurrentPage] = useState<number>(MASTER_PAYMENT_METHOD_CONFIG.DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(MASTER_PAYMENT_METHOD_CONFIG.DEFAULT_PAGE_SIZE);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const queryParams = useMemo(
    (): PaymentMethodListParams => ({ pageNumber: currentPage, pageSize, searchTerm }),
    [currentPage, pageSize, searchTerm],
  );

  /**
   * Go to the given page, never below the first page.
   * @param {number} page - Requested page
   * @returns {void}
   */
  const handlePageChange = useCallback((page: number): void => {
    setCurrentPage(Math.max(MASTER_PAYMENT_METHOD_CONFIG.DEFAULT_PAGE, page));
  }, []);

  /**
   * Change page size and return to the first page.
   * @param {number} size - New page size
   * @returns {void}
   */
  const handlePageSizeChange = useCallback((size: number): void => {
    setPageSize(size);
    setCurrentPage(MASTER_PAYMENT_METHOD_CONFIG.DEFAULT_PAGE);
  }, []);

  /**
   * Update the search term and return to the first page.
   * @param {ChangeEvent<HTMLInputElement>} event - Search input change event
   * @returns {void}
   */
  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
    setCurrentPage(MASTER_PAYMENT_METHOD_CONFIG.DEFAULT_PAGE);
  }, []);

  return { queryParams, currentPage, pageSize, handlePageChange, handlePageSizeChange, handleSearchChange };
};

/**
 * Create the navigation handlers of the payment method list.
 * @returns {PaymentMethodNavigation} - Back, create and edit handlers
 */
const usePaymentMethodNavigation = (): PaymentMethodNavigation => {
  const navigate = useNavigate();

  /**
   * Navigate back to the master data menu.
   * @returns {void}
   */
  const handleBack = useCallback((): void => {
    navigate(MASTER_PAYMENT_METHOD_ROUTE.MASTER_MAIN);
  }, [navigate]);

  /**
   * Navigate to the create payment method page.
   * @returns {void}
   */
  const handleCreate = useCallback((): void => {
    navigate(MASTER_PAYMENT_METHOD_ROUTE.CREATE);
  }, [navigate]);

  /**
   * Navigate to the edit page of a payment method.
   * @param {PaymentMethodData} paymentMethod - Payment method to edit
   * @returns {void}
   */
  const handleEdit = useCallback((paymentMethod: PaymentMethodData): void => {
    navigate(`${MASTER_PAYMENT_METHOD_ROUTE.EDIT}/${paymentMethod.id}`, { state: { paymentMethod: paymentMethod.source } });
  }, [navigate]);

  return { handleBack, handleCreate, handleEdit };
};

/**
 * Manage payment method list paging, search and navigation.
 * @returns {MasterPaymentMethodController} - List query params, state and handlers
 */
export const useMasterPaymentMethod = (): MasterPaymentMethodController => ({
  ...usePaymentMethodListPaging(),
  ...usePaymentMethodNavigation(),
});
