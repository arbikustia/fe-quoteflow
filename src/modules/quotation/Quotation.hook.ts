import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type {
  QuotationData,
  QuotationListApiState,
  QuotationListResponse,
  QuotationNavigation,
  QuotationPagination,
} from "./Quotation.type";

import { mapQuotation, useGetQuotationsQuery } from "@/services/quotation.service";

/**
 * _createListState.
 * @param {string | null} errorMessage - errorMessage value.
 * @param {boolean} isLoading - isLoading value.
 * @param {boolean} isMissingData - isMissingData value.
 * @returns {QuotationListApiState} - result.
 */
const _createListState = (
  errorMessage: string | null,
  isLoading: boolean,
  isMissingData: boolean,
): QuotationListApiState => ({
  isLoading,
  errorMessage,
  isMissingData,
  paginatedData: [],
  totalPages: 0,
  totalCount: 0,
});

/**
 * _deriveListState.
 * @param {ReturnType<typeof useGetQuotationsQuery>} query - query value.
 * @returns {QuotationListApiState} - result.
 */
const _deriveListState = (
  query: ReturnType<typeof useGetQuotationsQuery>,
): QuotationListApiState => {
  if (query.isLoading) return _createListState(null, true, false);

  if (query.error) return _createListState("Unable to load quotations.", false, false);

  const response: QuotationListResponse | undefined = query.data;

  if (!response) return _createListState("No response received from server.", false, true);

  if (!response.data) return _createListState("Response is missing data payload.", false, true);

  if (!response.status) return _createListState("Quotation data is unavailable.", false, false);

  return {
    isLoading: false,
    errorMessage: null,
    isMissingData: false,
    paginatedData: response.data.map(mapQuotation),
    totalPages: response.total_pages,
    totalCount: response.total_count,
  };
};

/**
 * useQuotationPagination.
 * @returns {QuotationPagination} - result.
 */
export const useQuotationPagination = (): QuotationPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTermState] = useState("");
  const query = useGetQuotationsQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const state = _deriveListState(query);
  /**
 * goToPage.
 * @param {number} page - page value.
 * @returns {void} - result.
 */
const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, state.totalPages)));
  /**
 * changePageSize.
 * @param {number} size - size value.
 * @returns {void} - result.
 */
const changePageSize = (size: number): void => { setPageSize(size); setCurrentPage(1); };
  /**
 * setSearchTerm.
 * @param {string} value - value value.
 * @returns {void} - result.
 */
const setSearchTerm = (value: string): void => { setSearchTermState(value); setCurrentPage(1); };

  return {
    ...state,
    currentPage,
    pageSize,
    isEmpty: !state.isLoading && !state.errorMessage && !state.isMissingData && state.paginatedData.length === 0,
    goToPage,
    changePageSize,
    setSearchTerm,
  };
};

/**
 * useQuotationNavigation.
 * @returns {QuotationNavigation} - result.
 */
export const useQuotationNavigation = (): QuotationNavigation => {
  const navigate = useNavigate();
  /**
 * onBack.
 * @returns {void} - result.
 */
const onBack = (): void => { void navigate(-1); };
  /**
 * onEdit.
 * @param {QuotationData} quotation - quotation value.
 * @returns {void} - result.
 */
const onEdit = (quotation: QuotationData): void => { void navigate(`/order/edit/${quotation.transactionId}`); };
  /**
 * onStatus.
 * @param {QuotationData} quotation - quotation value.
 * @returns {void} - result.
 */
const onStatus = (quotation: QuotationData): void => { void navigate(`/document/quotation/${quotation.id}/status`); };
  /**
 * onDetail.
 * @param {QuotationData} quotation - quotation value.
 * @returns {void} - result.
 */
const onDetail = (quotation: QuotationData): void => { void navigate(`/document/quotation/${quotation.id}`); };
  /**
 * onRowClick.
 * @param {QuotationData} quotation - quotation value.
 * @returns {void} - result.
 */
const onRowClick = (quotation: QuotationData): void => { void navigate(`/document/quotation/${quotation.id}`); };

  return { onBack, onEdit, onDetail, onStatus, onRowClick };
};
