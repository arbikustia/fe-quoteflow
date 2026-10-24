import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { mapOrder, useGetOrdersQuery } from "@/services/order.service";

import type { BaseOrderState, OrderProps, OrderListResponse, QuoteData } from "./Order.type";

const EMPTY_FILTER = "";

export const useOrderPagination = (): Pick<OrderProps, "currentPage" | "totalPages" | "pageSize" | "paginatedData" | "totalCount" | "isLoading" | "errorMessage" | "isEmpty" | "goToPage" | "changePageSize" | "setSearchTerm"> => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({ type: EMPTY_FILTER, status: EMPTY_FILTER, startDate: EMPTY_FILTER, endDate: EMPTY_FILTER, searchTerm: EMPTY_FILTER });
  const query = useGetOrdersQuery({ pageNumber: currentPage, pageSize, ...filters });
  const response: OrderListResponse | undefined = query.data;
  const paginatedData: QuoteData[] = response?.data.map(mapOrder) ?? [];
  const errorMessage = query.error ? "Unable to load orders." : null;

  const goToPage = (page: number): void => setCurrentPage(Math.max(1, page));
  const changePageSize = (size: number): void => { setPageSize(size); setCurrentPage(1); };
  const setSearchTerm = (searchTerm: string): void => { setFilters((previous) => ({ ...previous, searchTerm })); setCurrentPage(1); };

  return { currentPage, totalPages: response?.total_pages ?? 0, pageSize, paginatedData, totalCount: response?.total_count ?? 0, isLoading: query.isLoading, errorMessage, isEmpty: !query.isLoading && !errorMessage && paginatedData.length === 0, goToPage, changePageSize, setSearchTerm };
};

export const useOrderState = (): BaseOrderState => {
  const navigate = useNavigate();
  const openCreateModal = (): void => { navigate("/order/create"); };
  const openEditModal = (quote: QuoteData): void => { navigate(`/order/edit/${quote.id}`); };
  const onRowClick = (quote: QuoteData): void => { navigate(`/order/detail/${quote.id}`); };
  const onBack = (): void => { void navigate(-1); };

  return { openCreateModal, openEditModal, onRowClick, onBack };
};
