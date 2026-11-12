import type { ChangeEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MASTER_PIC_CONFIG, MASTER_PIC_ROUTE } from "./MasterPic.config";
import type {
  MasterPicController,
  PicData,
  PicListPaging,
  PicListParams,
  PicNavigation,
} from "./MasterPic.type";

/**
 * Manage page, page size and search term of the PIC list.
 * @returns {PicListPaging} - Query params, paging state and handlers
 */
const usePicListPaging = (): PicListPaging => {
  const [currentPage, setCurrentPage] = useState<number>(MASTER_PIC_CONFIG.DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(MASTER_PIC_CONFIG.DEFAULT_PAGE_SIZE);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const queryParams = useMemo(
    (): PicListParams => ({ pageNumber: currentPage, pageSize, searchTerm }),
    [currentPage, pageSize, searchTerm],
  );

  /**
   * Go to the given page, never below the first page.
   * @param {number} page - Requested page
   * @returns {void}
   */
  const handlePageChange = useCallback((page: number): void => {
    setCurrentPage(Math.max(MASTER_PIC_CONFIG.DEFAULT_PAGE, page));
  }, []);

  /**
   * Change page size and return to the first page.
   * @param {number} size - New page size
   * @returns {void}
   */
  const handlePageSizeChange = useCallback((size: number): void => {
    setPageSize(size);
    setCurrentPage(MASTER_PIC_CONFIG.DEFAULT_PAGE);
  }, []);

  /**
   * Update the search term and return to the first page.
   * @param {ChangeEvent<HTMLInputElement>} event - Search input change event
   * @returns {void}
   */
  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
    setCurrentPage(MASTER_PIC_CONFIG.DEFAULT_PAGE);
  }, []);

  return { queryParams, currentPage, pageSize, handlePageChange, handlePageSizeChange, handleSearchChange };
};

/**
 * Create the navigation handlers of the PIC list.
 * @returns {PicNavigation} - Back, create and edit handlers
 */
const usePicNavigation = (): PicNavigation => {
  const navigate = useNavigate();

  /**
   * Navigate back to the master data menu.
   * @returns {void}
   */
  const handleBack = useCallback((): void => {
    navigate(MASTER_PIC_ROUTE.MASTER_MAIN);
  }, [navigate]);

  /**
   * Navigate to the create PIC page.
   * @returns {void}
   */
  const handleCreate = useCallback((): void => {
    navigate(MASTER_PIC_ROUTE.CREATE);
  }, [navigate]);

  /**
   * Navigate to the edit page of an PIC.
   * @param {PicData} pic - PIC to edit
   * @returns {void}
   */
  const handleEdit = useCallback((pic: PicData): void => {
    navigate(`${MASTER_PIC_ROUTE.EDIT}/${pic.id}`, { state: { pic } });
  }, [navigate]);

  return { handleBack, handleCreate, handleEdit };
};

/**
 * Manage PIC list paging, search and navigation.
 * @returns {MasterPicController} - List query params, state and handlers
 */
export const useMasterPic = (): MasterPicController => ({
  ...usePicListPaging(),
  ...usePicNavigation(),
});
