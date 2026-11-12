import type { ChangeEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MASTER_ORDER_TYPE_CONFIG, MASTER_ORDER_TYPE_ROUTE } from "./MasterOrderType.config";
import type {
  MasterOrderTypeController,
  OrderTypeData,
  OrderTypeListPaging,
  OrderTypeListParams,
  OrderTypeNavigation,
} from "./MasterOrderType.type";

/**
 * Manage page, page size and search term of the order type list.
 * @returns {OrderTypeListPaging} - Query params, paging state and handlers
 */
const useOrderTypeListPaging = (): OrderTypeListPaging => {
  const [currentPage, setCurrentPage] = useState<number>(MASTER_ORDER_TYPE_CONFIG.DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(MASTER_ORDER_TYPE_CONFIG.DEFAULT_PAGE_SIZE);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const queryParams = useMemo(
    (): OrderTypeListParams => ({ pageNumber: currentPage, pageSize, searchTerm }),
    [currentPage, pageSize, searchTerm],
  );

  /**
   * Go to the given page, never below the first page.
   * @param {number} page - Requested page
   * @returns {void}
   */
  const handlePageChange = useCallback((page: number): void => {
    setCurrentPage(Math.max(MASTER_ORDER_TYPE_CONFIG.DEFAULT_PAGE, page));
  }, []);

  /**
   * Change page size and return to the first page.
   * @param {number} size - New page size
   * @returns {void}
   */
  const handlePageSizeChange = useCallback((size: number): void => {
    setPageSize(size);
    setCurrentPage(MASTER_ORDER_TYPE_CONFIG.DEFAULT_PAGE);
  }, []);

  /**
   * Update the search term and return to the first page.
   * @param {ChangeEvent<HTMLInputElement>} event - Search input change event
   * @returns {void}
   */
  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
    setCurrentPage(MASTER_ORDER_TYPE_CONFIG.DEFAULT_PAGE);
  }, []);

  return { queryParams, currentPage, pageSize, handlePageChange, handlePageSizeChange, handleSearchChange };
};

/**
 * Create the navigation handlers of the order type list.
 * @returns {OrderTypeNavigation} - Back, create and edit handlers
 */
const useOrderTypeNavigation = (): OrderTypeNavigation => {
  const navigate = useNavigate();

  /**
   * Navigate back to the master data menu.
   * @returns {void}
   */
  const handleBack = useCallback((): void => {
    navigate(MASTER_ORDER_TYPE_ROUTE.MASTER_MAIN);
  }, [navigate]);

  /**
   * Navigate to the create order type page.
   * @returns {void}
   */
  const handleCreate = useCallback((): void => {
    navigate(MASTER_ORDER_TYPE_ROUTE.CREATE);
  }, [navigate]);

  /**
   * Navigate to the edit page of an order type.
   * @param {OrderTypeData} orderType - Order type to edit
   * @returns {void}
   */
  const handleEdit = useCallback((orderType: OrderTypeData): void => {
    navigate(`${MASTER_ORDER_TYPE_ROUTE.EDIT}/${orderType.id}`);
  }, [navigate]);

  return { handleBack, handleCreate, handleEdit };
};

/**
 * Manage order type list paging, search and navigation.
 * @returns {MasterOrderTypeController} - List query params, state and handlers
 */
export const useMasterOrderType = (): MasterOrderTypeController => ({
  ...useOrderTypeListPaging(),
  ...useOrderTypeNavigation(),
});
