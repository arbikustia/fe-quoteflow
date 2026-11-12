import type { ChangeEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MASTER_PROJECT_CONFIG, MASTER_PROJECT_ROUTE } from "./MasterProject.config";
import type {
  MasterProjectController,
  ProjectData,
  ProjectListPaging,
  ProjectListParams,
  ProjectNavigation,
} from "./MasterProject.type";

/**
 * Manage page, page size and search term of the project list.
 * @returns {ProjectListPaging} - Query params, paging state and handlers
 */
const useProjectListPaging = (): ProjectListPaging => {
  const [currentPage, setCurrentPage] = useState<number>(MASTER_PROJECT_CONFIG.DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(MASTER_PROJECT_CONFIG.DEFAULT_PAGE_SIZE);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const queryParams = useMemo(
    (): ProjectListParams => ({ pageNumber: currentPage, pageSize, searchTerm }),
    [currentPage, pageSize, searchTerm],
  );

  /**
   * Go to the given page, never below the first page.
   * @param {number} page - Requested page
   * @returns {void}
   */
  const handlePageChange = useCallback((page: number): void => {
    setCurrentPage(Math.max(MASTER_PROJECT_CONFIG.DEFAULT_PAGE, page));
  }, []);

  /**
   * Change page size and return to the first page.
   * @param {number} size - New page size
   * @returns {void}
   */
  const handlePageSizeChange = useCallback((size: number): void => {
    setPageSize(size);
    setCurrentPage(MASTER_PROJECT_CONFIG.DEFAULT_PAGE);
  }, []);

  /**
   * Update the search term and return to the first page.
   * @param {ChangeEvent<HTMLInputElement>} event - Search input change event
   * @returns {void}
   */
  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
    setCurrentPage(MASTER_PROJECT_CONFIG.DEFAULT_PAGE);
  }, []);

  return { queryParams, currentPage, pageSize, handlePageChange, handlePageSizeChange, handleSearchChange };
};

/**
 * Create the navigation handlers of the project list.
 * @returns {ProjectNavigation} - Back, create and edit handlers
 */
const useProjectNavigation = (): ProjectNavigation => {
  const navigate = useNavigate();

  /**
   * Navigate back to the master data menu.
   * @returns {void}
   */
  const handleBack = useCallback((): void => {
    navigate(MASTER_PROJECT_ROUTE.MASTER_MAIN);
  }, [navigate]);

  /**
   * Navigate to the create project page.
   * @returns {void}
   */
  const handleCreate = useCallback((): void => {
    navigate(MASTER_PROJECT_ROUTE.CREATE);
  }, [navigate]);

  /**
   * Navigate to the edit page of a project; the form loads the project by id.
   * @param {ProjectData} project - Project to edit
   * @returns {void}
   */
  const handleEdit = useCallback((project: ProjectData): void => {
    navigate(`${MASTER_PROJECT_ROUTE.EDIT}/${project.id}`);
  }, [navigate]);

  return { handleBack, handleCreate, handleEdit };
};

/**
 * Manage project list paging, search and navigation.
 * @returns {MasterProjectController} - List query params, state and handlers
 */
export const useMasterProject = (): MasterProjectController => ({
  ...useProjectListPaging(),
  ...useProjectNavigation(),
});
