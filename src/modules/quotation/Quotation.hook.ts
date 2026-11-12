import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { generateQuotationPDF } from "@/utils/pdfGenerator";

import type {
  QuotationData,
  QuotationListApiState,
  QuotationListResponse,
  QuotationNavigation,
  QuotationPagination,
} from "./Quotation.type";
import { quotationToQuoteData } from "./Quotation.util";

import { useGetAllItemsQuery } from "@/services/master-item.service";
import { mapQuotation, useGetQuotationsQuery, useLazyGetQuotationByIdQuery } from "@/services/quotation.service";

/**
 * Build an empty list state.
 * @param {string | null} errorMessage - Error message to show
 * @param {boolean} isLoading - Whether the list is loading
 * @param {boolean} isMissingData - Whether the response lacks data
 * @returns {QuotationListApiState} - Empty list state
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
 * Derive the list state from the quotations query.
 * @param {ReturnType<typeof useGetQuotationsQuery>} query - Quotations query result
 * @returns {QuotationListApiState} - List state
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
 * Build the item category lookup from master items.
 * @returns {Map<string, string>} - Item category names by item ID
 */
export const useItemCategories = (): Map<string, string> => {
  const { data: itemResponse } = useGetAllItemsQuery();

  return useMemo(
    (): Map<string, string> => new Map(
      itemResponse?.status
        ? itemResponse.data.map((item): [string, string] => [item.id, item.category_name ?? "Uncategorized"])
        : [],
    ),
    [itemResponse],
  );
};

/**
 * Manage quotation list paging, search and query state.
 * @returns {QuotationPagination} - Pagination state and handlers
 */
export const useQuotationPagination = (): QuotationPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTermState] = useState("");
  const query = useGetQuotationsQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const state = _deriveListState(query);
  /**
   * Go to a page within the available range.
   * @param {number} page - Requested page
   * @returns {void} - No return value
   */
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, state.totalPages)));

  /**
   * Change quotation page size.
   * @param {number} size - Requested page size
   * @returns {void} - No return value
   */
  const changePageSize = (size: number): void => {
    setPageSize(size);
    setCurrentPage(1);
  };

  /**
   * Change quotation search term.
   * @param {string} value - Search value
   * @returns {void} - No return value
   */
  const setSearchTerm = (value: string): void => {
    setSearchTermState(value);
    setCurrentPage(1);
  };

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
 * Build quotation list navigation and download handlers.
 * @returns {QuotationNavigation} - Navigation handlers
 */
export const useQuotationNavigation = (): QuotationNavigation => {
  const navigate = useNavigate();
  const [getQuotation] = useLazyGetQuotationByIdQuery();
  const itemCategories = useItemCategories();
  /**
   * Go back to the document menu.
   * @returns {void} - No return value
   */
  const onBack = (): void => { void navigate("/document"); };

  /**
   * Open the order form for the quotation.
   * @param {QuotationData} quotation - Selected quotation
   * @returns {void} - No return value
   */
  const onEdit = (quotation: QuotationData): void => {
    const targetId = quotation.transactionId || quotation.id;

    void navigate(`/order/create/${targetId}`, {
      state: { returnUrl: "/document/quotation", quotationId: quotation.id },
    });
  };

  /**
   * Open the quotation status page.
   * @param {QuotationData} quotation - Selected quotation
   * @returns {void} - No return value
   */
  const onStatus = (quotation: QuotationData): void => { void navigate(`/document/quotation/${quotation.id}`); };

  /**
   * Open the quotation detail page.
   * @param {QuotationData} quotation - Selected quotation
   * @returns {void} - No return value
   */
  const onDetail = (quotation: QuotationData): void => { void navigate(`/document/quotation/${quotation.id}`); };

  /**
   * Open the quotation detail page from a row.
   * @param {QuotationData} quotation - Selected quotation
   * @returns {void} - No return value
   */
  const onRowClick = (quotation: QuotationData): void => { void navigate(`/document/quotation/${quotation.id}`); };

  /**
   * Download quotation using complete detail data.
   * @param {QuotationData} quotation - Selected quotation
   * @returns {Promise<void>} Completion promise
   */
  const onDownload = async (quotation: QuotationData): Promise<void> => {
    const response = await getQuotation(quotation.id).unwrap();

    if (response.data) {
      generateQuotationPDF(quotationToQuoteData(response.data, itemCategories));
    }
  };

  return { onBack, onEdit, onDetail, onStatus, onRowClick, onDownload };
};
