import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMasterActivityLog } from "@/hooks/useMasterActivityLog";

import { RETURN_PAGE_SIZE_DEFAULT } from "./ItemReturn.config";
import type { ReturnListData, ReturnListState, ReturnNavigationState, ReturnRow } from "./ItemReturn.type";
import { getReturnListError, mapReturn } from "./ItemReturn.util";

import { useGetRentalReturnsPagedQuery } from "@/services/rental-return.service";

/**
 * Return navigation handlers for item return module.
 * @returns {ReturnNavigationState} Navigation callbacks
 */
export const useItemReturnNavigation = (): ReturnNavigationState => {
  const navigate = useNavigate();

  /**
   * Go back to home.
   * @returns {void} Nothing
   */
  const onBack = (): void => {
    void navigate("/home");
  };

  /**
   * Open the create page.
   * @returns {void} Nothing
   */
  const onCreate = (): void => {
    void navigate("/item-return/create");
  };

  /**
   * Open the edit page of a row.
   * @param {ReturnRow} row - Return row
   * @returns {void} Nothing
   */
  const onEdit = (row: ReturnRow): void => {
    void navigate(`/item-return/create/${row.id}`);
  };

  return { onBack, onCreate, onEdit, onRowClick: onEdit };
};

/**
 * Return data fetching and pagination state for item return list.
 * @returns {ReturnListData} List state
 */
export const useItemReturnList = (): ReturnListData => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(RETURN_PAGE_SIZE_DEFAULT);
  const [searchTerm, setSearchTermState] = useState("");
  const { logView } = useMasterActivityLog("Item Return");
  const query = useGetRentalReturnsPagedQuery({ pageNumber: currentPage, pageSize, searchTerm });

  useEffect((): void => {
    void logView();
  }, [logView]);

  const rows = query.data?.status && Array.isArray(query.data.data) ? query.data.data.map(mapReturn) : [];
  const totalPages = query.data?.total_pages ?? 0;
  const errorMessage = getReturnListError(Boolean(query.error), query.data);

  /**
   * Update search term and reset to the first page.
   * @param {string} value - Search term
   * @returns {void} Nothing
   */
  const setSearchTerm = (value: string): void => {
    setSearchTermState(value);
    setCurrentPage(1);
  };

  /**
   * Go to a page within range.
   * @param {number} page - Target page
   * @returns {void} Nothing
   */
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, totalPages || 1)));

  /**
   * Change page size and reset to the first page.
   * @param {number} size - Page size
   * @returns {void} Nothing
   */
  const changePageSize = (size: number): void => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    pageSize,
    totalCount: query.data?.total_count ?? 0,
    rows,
    isLoading: query.isLoading,
    errorMessage,
    isEmpty: !query.isLoading && !errorMessage && rows.length === 0,
    setSearchTerm,
    goToPage,
    changePageSize,
  };
};

/**
 * Return full combined state for item return page.
 * @returns {ReturnListState} Complete state
 */
export const useItemReturnState = (): ReturnListState => {
  const list = useItemReturnList();
  const navigation = useItemReturnNavigation();

  return { ...list, ...navigation };
};
