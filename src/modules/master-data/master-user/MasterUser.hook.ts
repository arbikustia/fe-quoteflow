import type { ChangeEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MASTER_USER_CONFIG, MASTER_USER_ROUTE } from "./MasterUser.config";
import type {
  MasterUserController,
  UserData,
  UserListPaging,
  UserListParams,
  UserNavigation,
} from "./MasterUser.type";

/**
 * Manage page, page size and search term of the user list.
 * @returns {UserListPaging} - Query params, paging state and handlers
 */
const useUserListPaging = (): UserListPaging => {
  const [currentPage, setCurrentPage] = useState<number>(MASTER_USER_CONFIG.DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(MASTER_USER_CONFIG.DEFAULT_PAGE_SIZE);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const queryParams = useMemo(
    (): UserListParams => ({ PageNumber: currentPage, PageSize: pageSize, SearchTerm: searchTerm }),
    [currentPage, pageSize, searchTerm],
  );

  /**
   * Go to the given page, never below the first page.
   * @param {number} page - Requested page
   * @returns {void}
   */
  const handlePageChange = useCallback((page: number): void => {
    setCurrentPage(Math.max(MASTER_USER_CONFIG.DEFAULT_PAGE, page));
  }, []);

  /**
   * Change page size and return to the first page.
   * @param {number} size - New page size
   * @returns {void}
   */
  const handlePageSizeChange = useCallback((size: number): void => {
    setPageSize(size);
    setCurrentPage(MASTER_USER_CONFIG.DEFAULT_PAGE);
  }, []);

  /**
   * Update the search term and return to the first page.
   * @param {ChangeEvent<HTMLInputElement>} event - Search input change event
   * @returns {void}
   */
  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
    setCurrentPage(MASTER_USER_CONFIG.DEFAULT_PAGE);
  }, []);

  return { queryParams, currentPage, pageSize, handlePageChange, handlePageSizeChange, handleSearchChange };
};

/**
 * Create the navigation handlers of the user list.
 * @returns {UserNavigation} - Back, create and edit handlers
 */
const useUserNavigation = (): UserNavigation => {
  const navigate = useNavigate();

  /**
   * Navigate back to the master data menu.
   * @returns {void}
   */
  const handleBack = useCallback((): void => {
    navigate(MASTER_USER_ROUTE.MASTER_MAIN);
  }, [navigate]);

  /**
   * Navigate to the create user page.
   * @returns {void}
   */
  const handleCreate = useCallback((): void => {
    navigate(MASTER_USER_ROUTE.CREATE);
  }, [navigate]);

  /**
   * Navigate to the edit page of a user.
   * @param {UserData} user - User to edit
   * @returns {void}
   */
  const handleEdit = useCallback((user: UserData): void => {
    navigate(`${MASTER_USER_ROUTE.EDIT}/${user.id}`);
  }, [navigate]);

  return { handleBack, handleCreate, handleEdit };
};

/**
 * Manage user list paging, search and navigation.
 * @returns {MasterUserController} - List query params, state and handlers
 */
export const useMasterUser = (): MasterUserController => ({
  ...useUserListPaging(),
  ...useUserNavigation(),
});
