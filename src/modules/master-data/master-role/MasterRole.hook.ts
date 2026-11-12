import type { ChangeEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MASTER_ROLE_CONFIG, MASTER_ROLE_ROUTE } from "./MasterRole.config";
import type {
  MasterRoleController,
  RoleData,
  RoleListPaging,
  RoleListParams,
  RoleNavigation,
} from "./MasterRole.type";

/**
 * Manage page, page size and search term of the role list.
 * @returns {RoleListPaging} - Query params, paging state and handlers
 */
const useRoleListPaging = (): RoleListPaging => {
  const [currentPage, setCurrentPage] = useState<number>(MASTER_ROLE_CONFIG.DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(MASTER_ROLE_CONFIG.DEFAULT_PAGE_SIZE);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const queryParams = useMemo(
    (): RoleListParams => ({ pageNumber: currentPage, pageSize, searchTerm }),
    [currentPage, pageSize, searchTerm],
  );

  /**
   * Go to the given page, never below the first page.
   * @param {number} page - Requested page
   * @returns {void}
   */
  const handlePageChange = useCallback((page: number): void => {
    setCurrentPage(Math.max(MASTER_ROLE_CONFIG.DEFAULT_PAGE, page));
  }, []);

  /**
   * Change page size and return to the first page.
   * @param {number} size - New page size
   * @returns {void}
   */
  const handlePageSizeChange = useCallback((size: number): void => {
    setPageSize(size);
    setCurrentPage(MASTER_ROLE_CONFIG.DEFAULT_PAGE);
  }, []);

  /**
   * Update the search term and return to the first page.
   * @param {ChangeEvent<HTMLInputElement>} event - Search input change event
   * @returns {void}
   */
  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
    setCurrentPage(MASTER_ROLE_CONFIG.DEFAULT_PAGE);
  }, []);

  return { queryParams, currentPage, pageSize, handlePageChange, handlePageSizeChange, handleSearchChange };
};

/**
 * Create the navigation handlers of the role list.
 * @returns {RoleNavigation} - Back, create and edit handlers
 */
const useRoleNavigation = (): RoleNavigation => {
  const navigate = useNavigate();

  /**
   * Navigate back to the master data menu.
   * @returns {void}
   */
  const handleBack = useCallback((): void => {
    navigate(MASTER_ROLE_ROUTE.MASTER_MAIN);
  }, [navigate]);

  /**
   * Navigate to the create role page.
   * @returns {void}
   */
  const handleCreate = useCallback((): void => {
    navigate(MASTER_ROLE_ROUTE.CREATE);
  }, [navigate]);

  /**
   * Navigate to the edit page of a role.
   * @param {RoleData} role - Role to edit
   * @returns {void}
   */
  const handleEdit = useCallback((role: RoleData): void => {
    navigate(`${MASTER_ROLE_ROUTE.EDIT}/${role.id}`);
  }, [navigate]);

  return { handleBack, handleCreate, handleEdit };
};

/**
 * Manage role list paging, search and navigation.
 * @returns {MasterRoleController} - List query params, state and handlers
 */
export const useMasterRole = (): MasterRoleController => ({
  ...useRoleListPaging(),
  ...useRoleNavigation(),
});
