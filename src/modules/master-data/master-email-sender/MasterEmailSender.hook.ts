import type { ChangeEvent } from "react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MASTER_EMAIL_SENDER_CONFIG, MASTER_EMAIL_SENDER_ROUTE } from "./MasterEmailSender.config";
import type {
  EmailSenderData,
  EmailSenderListPaging,
  EmailSenderListParams,
  EmailSenderNavigation,
  MasterEmailSenderController,
} from "./MasterEmailSender.type";

/**
 * Manage page, page size and search term of the email sender list.
 * @returns {EmailSenderListPaging} - Query params, paging state and handlers
 */
const useEmailSenderListPaging = (): EmailSenderListPaging => {
  const [currentPage, setCurrentPage] = useState<number>(MASTER_EMAIL_SENDER_CONFIG.DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(MASTER_EMAIL_SENDER_CONFIG.DEFAULT_PAGE_SIZE);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const queryParams = useMemo(
    (): EmailSenderListParams => ({ pageNumber: currentPage, pageSize, searchTerm }),
    [currentPage, pageSize, searchTerm],
  );

  /**
   * Go to the given page, never below the first page.
   * @param {number} page - Requested page
   * @returns {void}
   */
  const handlePageChange = useCallback((page: number): void => {
    setCurrentPage(Math.max(MASTER_EMAIL_SENDER_CONFIG.DEFAULT_PAGE, page));
  }, []);

  /**
   * Change page size and return to the first page.
   * @param {number} size - New page size
   * @returns {void}
   */
  const handlePageSizeChange = useCallback((size: number): void => {
    setPageSize(size);
    setCurrentPage(MASTER_EMAIL_SENDER_CONFIG.DEFAULT_PAGE);
  }, []);

  /**
   * Update the search term and return to the first page.
   * @param {ChangeEvent<HTMLInputElement>} event - Search input change event
   * @returns {void}
   */
  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
    setCurrentPage(MASTER_EMAIL_SENDER_CONFIG.DEFAULT_PAGE);
  }, []);

  return { queryParams, currentPage, pageSize, handlePageChange, handlePageSizeChange, handleSearchChange };
};

/**
 * Create the navigation handlers of the email sender list.
 * @returns {EmailSenderNavigation} - Back, create and edit handlers
 */
const useEmailSenderNavigation = (): EmailSenderNavigation => {
  const navigate = useNavigate();

  /**
   * Navigate back to the master data menu.
   * @returns {void}
   */
  const handleBack = useCallback((): void => {
    navigate(MASTER_EMAIL_SENDER_ROUTE.MASTER_MAIN);
  }, [navigate]);

  /**
   * Navigate to the create email sender page.
   * @returns {void}
   */
  const handleCreate = useCallback((): void => {
    navigate(MASTER_EMAIL_SENDER_ROUTE.CREATE);
  }, [navigate]);

  /**
   * Navigate to the edit page of an email sender.
   * @param {EmailSenderData} emailSender - Sender to edit
   * @returns {void}
   */
  const handleEdit = useCallback((emailSender: EmailSenderData): void => {
    navigate(`${MASTER_EMAIL_SENDER_ROUTE.EDIT}/${emailSender.id}`);
  }, [navigate]);

  return { handleBack, handleCreate, handleEdit };
};

/**
 * Manage email sender list paging, search and navigation.
 * @returns {MasterEmailSenderController} - List query params, state and handlers
 */
export const useMasterEmailSender = (): MasterEmailSenderController => ({
  ...useEmailSenderListPaging(),
  ...useEmailSenderNavigation(),
});
