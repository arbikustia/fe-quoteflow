import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { BaseOrderState, OrderListResponse, OrderProps, QuoteData } from "./Order.type";

import { mapOrder, useGetOrdersQuery } from "@/services/order.service";

const EMPTY_FILTER = "";

/**
 * Load, paginate and filter the order list.
 * @returns {Pick<OrderProps, "currentPage" | "totalPages" | "pageSize" | "paginatedData" | "totalCount" | "isLoading" | "errorMessage" | "isEmpty" | "goToPage" | "changePageSize" | "setSearchTerm">} - Pagination state and handlers
 */
export const useOrderPagination = (): Pick<OrderProps, "currentPage" | "totalPages" | "pageSize" | "paginatedData" | "totalCount" | "isLoading" | "errorMessage" | "isEmpty" | "goToPage" | "changePageSize" | "setSearchTerm"> => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({ type: EMPTY_FILTER, status: EMPTY_FILTER, startDate: EMPTY_FILTER, endDate: EMPTY_FILTER, searchTerm: EMPTY_FILTER });
  const query = useGetOrdersQuery({ pageNumber: currentPage, pageSize, ...filters });
  const response: OrderListResponse | undefined = query.data;
  const paginatedData: QuoteData[] = response?.data?.map(mapOrder) ?? [];
  let errorMessage: string | null = null;

  if (query.error) {
    errorMessage = "Unable to load orders.";
  } else if (response && !response.status) {
    errorMessage = "Order data is unavailable.";
  } else if (response && !response.data) {
    errorMessage = "Order response is missing data.";
  }

  /**
 * Go to a page, never below the first.
 * @param {number} page - Target page
 * @returns {void} - No return value
 */
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, page));
  /**
 * Change the page size and return to the first page.
 * @param {number} size - New page size
 * @returns {void} - No return value
 */
  const changePageSize = (size: number): void => { setPageSize(size); setCurrentPage(1); };
  /**
 * Filter the list by search term and return to the first page.
 * @param {string} searchTerm - Search term
 * @returns {void} - No return value
 */
  const setSearchTerm = (searchTerm: string): void => { setFilters((previous) => ({ ...previous, searchTerm })); setCurrentPage(1); };

  return { currentPage, totalPages: response?.total_pages ?? 0, pageSize, paginatedData, totalCount: response?.total_count ?? 0, isLoading: query.isLoading, errorMessage, isEmpty: !query.isLoading && !errorMessage && paginatedData.length === 0, goToPage, changePageSize, setSearchTerm };
};

/**
 * Build the order list navigation state.
 * @returns {BaseOrderState} - Navigation state and handlers
 */
export const useOrderState = (): BaseOrderState => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const canCreateOrder = pathname !== "/order/draft";
  /**
 * Open the order create page.
 * @returns {void} - No return value
 */
  const openCreateModal = (): void => { navigate("/order/create"); };
  /**
 * Open the order edit page.
 * @param {QuoteData} quote - Order row
 * @returns {void} - No return value
 */
  const openEditModal = (quote: QuoteData): void => { navigate(`/order/edit/${quote.id}`); };
  /**
 * Open the order detail page.
 * @param {QuoteData} quote - Order row
 * @returns {void} - No return value
 */
  const onRowClick = (quote: QuoteData): void => { navigate(`/order/detail/${quote.id}`); };
  /**
 * Go back one page.
 * @returns {void} - No return value
 */
  const onBack = (): void => { void navigate(-1); };

  return { canCreateOrder, openCreateModal, openEditModal, onRowClick, onBack };
};
