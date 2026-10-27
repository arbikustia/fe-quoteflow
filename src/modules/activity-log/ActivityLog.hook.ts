import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MOCK_ACTIVITY_LOG_RESPONSE } from "@/fixture/activity-logs";
import { mapActivityLog, useGetActivityLogsQuery } from "@/services/activity-log.service";

import type { ActivityLogData, ActivityLogPageData, ActivityLogPagination } from "./ActivityLog.type";

/**
 * Fetch activity logs and expose pagination state.
 * @returns {ActivityLogPagination} Activity log pagination state
 */
export const useActivityLogPagination = (): ActivityLogPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTermState] = useState("");
  const query = useGetActivityLogsQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const response = query.data;
  const isUsingFixture = Boolean(response?.status && response.data.length === 0);
  const sourceData = isUsingFixture ? MOCK_ACTIVITY_LOG_RESPONSE.data : response?.data ?? [];
  const pageData: ActivityLogPageData = {
    paginatedData: sourceData.map(mapActivityLog),
    totalPages: isUsingFixture ? Math.max(1, Math.ceil(sourceData.length / pageSize)) : response?.total_pages ?? 0,
    totalCount: isUsingFixture ? sourceData.length : response?.total_count ?? 0,
  };
  const paginatedData: ActivityLogData[] = pageData.paginatedData;
  let errorMessage: string | null = null;

  if (query.error) errorMessage = "Unable to load activity logs.";

  if (response && !response.status) errorMessage = response.messages.join(" ") || "Activity log data is unavailable.";

  /**
   * Change activity log page.
   * @param {number} page - Requested page
   * @returns {void} No return value
   */
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, pageData.totalPages)));

  /**
   * Change activity log page size.
   * @param {number} size - Requested page size
   * @returns {void} No return value
   */
  const changePageSize = (size: number): void => { setPageSize(size); setCurrentPage(1); };

  /**
   * Change activity log search term.
   * @param {string} value - Search query
   * @returns {void} No return value
   */
  const setSearchTerm = (value: string): void => { setSearchTermState(value); setCurrentPage(1); };

  return {
    currentPage,
    totalPages: pageData.totalPages,
    pageSize,
    paginatedData,
    totalCount: pageData.totalCount,
    isLoading: query.isLoading,
    errorMessage,
    isEmpty: !query.isLoading && !errorMessage && paginatedData.length === 0,
    goToPage,
    changePageSize,
    setSearchTerm,
  };
};

/**
 * Provide activity log navigation.
 * @returns {{onBack: () => void}} Navigation callbacks
 */
export const useActivityLogNavigation = (): { onBack: () => void } => {
  const navigate = useNavigate();
  const onBack = (): void => { void navigate(-1); };

  return { onBack };
};
