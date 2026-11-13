import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MAIL_CONFIG } from "./Mail.config";
import type { MailListApiState, MailNavigation, MailPagination } from "./Mail.type";

import { mapMail, useGetMailsQuery } from "@/services/mail/mail.service";

/**
 * Hook for mail navigation.
 * @returns {MailNavigation} Navigation functions
 */
export const useMailNavigation = (): MailNavigation => {
  const navigate = useNavigate();

  /**
   * Navigate back.
   * @returns {void} - Nothing
   */
  const goBack = (): void => {
    navigate("/home");
  };

  /**
   * Navigate to the compose page.
   * @returns {void} - Nothing
   */
  const goCompose = (): void => {
    navigate("/mail/create");
  };

  return { goBack, goCompose };
};

/**
 * Create mail list state without paginated data.
 * @param {boolean} isLoading - Whether mail data is loading
 * @param {boolean} isMissingData - Whether API response data is missing
 * @param {string} [errorMessage] - Mail list error message
 * @returns {MailListApiState} Empty mail list state
 */
const _createMailListState = (isLoading: boolean, isMissingData: boolean, errorMessage?: string): MailListApiState => ({
  isLoading,
  errorMessage,
  isMissingData,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * Derive paginated state from API response envelope.
 * @param {ReturnType<typeof useGetMailsQuery>} queryResult - RTK Query result
 * @returns {MailListApiState} Derived state
 */
const _deriveMailListState = (queryResult: ReturnType<typeof useGetMailsQuery>): MailListApiState => {
  const { data, error, isLoading } = queryResult;

  if (isLoading) {
    return _createMailListState(true, false);
  }

  if (error) {
    return _createMailListState(false, false, "Unable to load mails.");
  }

  const response = data;

  if (!response?.data) {
    return _createMailListState(false, true, "Response is missing data.");
  }

  return {
    isLoading: false,
    isMissingData: false,
    paginatedData: response.data.map(mapMail),
    totalPages: response.total_pages,
    totalCount: response.total_count,
  };
};

/**
 * Hook for API-backed mail pagination.
 * @returns {MailPagination} Mail pagination state and handlers
 */
export const useMailPagination = (): MailPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(MAIL_CONFIG.DEFAULT_PAGE_SIZE);
  const [searchTerm, setSearchTerm] = useState("");

  const queryResult = useGetMailsQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const derived = _deriveMailListState(queryResult);

  /**
   * Handle page change.
   * @param {number} page - New page number
   * @returns {void} - Nothing
   */
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, derived.totalPages)));

  /**
   * Handle page size change.
   * @param {number} size - New page size
   * @returns {void} - Nothing
   */
  const changePageSize = (size: number): void => {
    setPageSize(size);
    setCurrentPage(1);
  };

  /**
   * Handle search term change.
   * @param {string} value - Search term
   * @returns {void} - Nothing
   */
  const handleSearchTerm = (value: string): void => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages: derived.totalPages,
    pageSize,
    paginatedData: derived.paginatedData,
    totalCount: derived.totalCount,
    isLoading: derived.isLoading,
    errorMessage: derived.errorMessage,
    isEmpty: !derived.isLoading && !derived.errorMessage && !derived.isMissingData && derived.paginatedData.length === 0,
    isMissingData: derived.isMissingData,
    goToPage,
    changePageSize,
    setSearchTerm: handleSearchTerm,
  };
};
