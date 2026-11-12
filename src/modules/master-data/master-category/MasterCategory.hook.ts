import type { ChangeEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MASTER_CATEGORY_CONFIG, MASTER_CATEGORY_ROUTE } from "./MasterCategory.config";
import type {
  CategoryData,
  CategoryListPaging,
  CategoryListParams,
  CategoryNavigation,
  MasterCategoryController,
} from "./MasterCategory.type";

/**
 * Manage page, page size and search term of the category list.
 * @returns {CategoryListPaging} - Query params, paging state and handlers
 */
const useCategoryListPaging = (): CategoryListPaging => {
  const [currentPage, setCurrentPage] = useState<number>(MASTER_CATEGORY_CONFIG.DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(MASTER_CATEGORY_CONFIG.DEFAULT_PAGE_SIZE);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const queryParams = useMemo(
    (): CategoryListParams => ({ pageNumber: currentPage, pageSize, searchTerm }),
    [currentPage, pageSize, searchTerm],
  );

  /**
   * Go to the given page, never below the first page.
   * @param {number} page - Requested page
   * @returns {void}
   */
  const handlePageChange = useCallback((page: number): void => {
    setCurrentPage(Math.max(MASTER_CATEGORY_CONFIG.DEFAULT_PAGE, page));
  }, []);

  /**
   * Change page size and return to the first page.
   * @param {number} size - New page size
   * @returns {void}
   */
  const handlePageSizeChange = useCallback((size: number): void => {
    setPageSize(size);
    setCurrentPage(MASTER_CATEGORY_CONFIG.DEFAULT_PAGE);
  }, []);

  /**
   * Update the search term and return to the first page.
   * @param {ChangeEvent<HTMLInputElement>} event - Search input change event
   * @returns {void}
   */
  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
    setCurrentPage(MASTER_CATEGORY_CONFIG.DEFAULT_PAGE);
  }, []);

  return { queryParams, currentPage, pageSize, handlePageChange, handlePageSizeChange, handleSearchChange };
};

/**
 * Create the navigation handlers of the category list.
 * @returns {CategoryNavigation} - Back, create and edit handlers
 */
const useCategoryNavigation = (): CategoryNavigation => {
  const navigate = useNavigate();

  /**
   * Navigate back to the master data menu.
   * @returns {void}
   */
  const handleBack = useCallback((): void => {
    navigate(MASTER_CATEGORY_ROUTE.MASTER_MAIN);
  }, [navigate]);

  /**
   * Navigate to the create category page.
   * @returns {void}
   */
  const handleCreate = useCallback((): void => {
    navigate(MASTER_CATEGORY_ROUTE.CREATE);
  }, [navigate]);

  /**
   * Navigate to the edit page of a category.
   * @param {CategoryData} category - Category to edit
   * @returns {void}
   */
  const handleEdit = useCallback((category: CategoryData): void => {
    navigate(`${MASTER_CATEGORY_ROUTE.EDIT}/${category.id}`);
  }, [navigate]);

  return { handleBack, handleCreate, handleEdit };
};

/**
 * Manage category list paging, search and navigation.
 * @returns {MasterCategoryController} - List query params, state and handlers
 */
export const useMasterCategory = (): MasterCategoryController => ({
  ...useCategoryListPaging(),
  ...useCategoryNavigation(),
});
