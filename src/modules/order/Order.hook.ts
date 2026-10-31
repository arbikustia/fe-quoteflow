import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { BaseOrderState, OrderListResponse, OrderProps, QuoteData } from "./Order.type";

import { mapOrder, useGetOrdersQuery } from "@/services/order.service";

const EMPTY_FILTER = "";

/**
 * Handle module operation.
 * @returns {Pick<OrderProps, "currentPage" | "totalPages" | "pageSize" | "paginatedData" | "totalCount" | "isLoading" | "errorMessage" | "isEmpty" | "goToPage" | "changePageSize" | "setSearchTerm">} - Operation result
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
 * Handle module operation.
 * @param {number} page - page value
 * @returns {void} - Operation result
 */
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, page));
  /**
 * Handle module operation.
 * @param {number} size - size value
 * @returns {void} - Operation result
 */
  const changePageSize = (size: number): void => { setPageSize(size); setCurrentPage(1); };
  /**
 * Handle module operation.
 * @param {string} searchTerm - searchTerm value
 * @returns {void} - Operation result
 */
  const setSearchTerm = (searchTerm: string): void => { setFilters((previous) => ({ ...previous, searchTerm })); setCurrentPage(1); };

  return { currentPage, totalPages: response?.total_pages ?? 0, pageSize, paginatedData, totalCount: response?.total_count ?? 0, isLoading: query.isLoading, errorMessage, isEmpty: !query.isLoading && !errorMessage && paginatedData.length === 0, goToPage, changePageSize, setSearchTerm };
};

/**
 * Handle module operation.
 * @returns {BaseOrderState} - Operation result
 */
export const useOrderState = (): BaseOrderState => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const canCreateOrder = pathname !== "/order/draft";
  /**
 * Handle module operation.
 * @returns {void} - Operation result
 */
  const openCreateModal = (): void => { navigate("/order/create"); };
  /**
 * Handle module operation.
 * @param {QuoteData} quote - quote value
 * @returns {void} - Operation result
 */
  const openEditModal = (quote: QuoteData): void => { navigate(`/order/edit/${quote.id}`); };
  /**
 * Handle module operation.
 * @param {QuoteData} quote - quote value
 * @returns {void} - Operation result
 */
  const onRowClick = (quote: QuoteData): void => { navigate(`/order/detail/${quote.id}`); };
  /**
 * Handle module operation.
 * @returns {void} - Operation result
 */
  const onBack = (): void => { void navigate(-1); };

  return { canCreateOrder, openCreateModal, openEditModal, onRowClick, onBack };
};
