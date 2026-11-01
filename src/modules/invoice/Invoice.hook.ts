import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { InvoiceData, InvoicePageData, InvoicePagination } from "./Invoice.type";

import { mapInvoice, useGetInvoicesQuery } from "@/services/invoice.service";

/**
 * Derive invoice rows from API.
 * @param {ReturnType<typeof useGetInvoicesQuery>} query - Invoice query
 * @returns {InvoicePageData} Invoice page data
 */
const _getInvoicePageData = (
  query: ReturnType<typeof useGetInvoicesQuery>,
): InvoicePageData => {
  const response = query.data;
  const apiInvoices = response?.data ?? [];

  return {
    paginatedData: apiInvoices.map(mapInvoice),
    totalPages: response?.total_pages ?? 0,
    totalCount: response?.total_count ?? 0,
  };
};

/**
 * Fetch invoices and expose list state.
 * @returns {InvoicePagination} Invoice pagination state
 */
export const useInvoicePagination = (): InvoicePagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTermState] = useState("");
  const query = useGetInvoicesQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const pageData = _getInvoicePageData(query);
  const boundedCurrentPage = Math.max(1, Math.min(currentPage, pageData.totalPages || 1));
  let errorMessage: string | null = null;

  if (query.isError) {
    errorMessage = "Unable to load invoices.";
  }

  /**
   * Set search term and reset pagination.
   * @param {string} value - Invoice search term
   * @returns {void} No return value
   */
  const setSearchTerm = (value: string): void => {
    setSearchTermState(value);
    setCurrentPage(1);
  };

  /**
   * Go to a bounded invoice page.
   * @param {number} page - Requested page number
   * @returns {void} No return value
   */
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, pageData.totalPages || 1)));

  /**
   * Change invoice page size and reset pagination.
   * @param {number} size - Requested page size
   * @returns {void} No return value
   */
  const changePageSize = (size: number): void => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    currentPage: boundedCurrentPage,
    pageSize,
    paginatedData: pageData.paginatedData,
    totalPages: pageData.totalPages,
    totalCount: pageData.totalCount,
    isLoading: query.isLoading,
    isEmpty: !query.isLoading && !errorMessage && pageData.paginatedData.length === 0,
    errorMessage,
    setSearchTerm,
    goToPage,
    changePageSize,
  };
};

/**
 * Provide invoice navigation.
 * @returns {{onBack: () => void; onRowClick: (invoice: InvoiceData) => void; onDetail: (invoice: InvoiceData) => void; onEdit: (invoice: InvoiceData) => void}} Invoice navigation callbacks
 */
export const useInvoiceNavigation = (): {
  onBack: () => void;
  onRowClick: (invoice: InvoiceData) => void;
  onDetail: (invoice: InvoiceData) => void;
  onEdit: (invoice: InvoiceData) => void;
} => {
  const navigate = useNavigate();

  /**
   * Navigate back to document menu.
   * @returns {void} No return value
   */
  const onBack = (): void => { void navigate("/document"); };

  /**
   * Navigate to invoice detail.
   * @param {InvoiceData} invoice - Selected invoice
   * @returns {void} No return value
   */
  const onDetail = (invoice: InvoiceData): void => { void navigate(`/document/invoice/${invoice.id}`); };

  /**
   * Open detail for clicked invoice row.
   * @param {InvoiceData} invoice - Selected invoice
   * @returns {void} No return value
   */
  const onRowClick = (invoice: InvoiceData): void => onDetail(invoice);

  /**
   * Navigate to invoice detail page for edit action.
   * @param {InvoiceData} invoice - Selected invoice
   * @returns {void} No return value
   */
  const onEdit = (invoice: InvoiceData): void => { void navigate(`/document/invoice/${invoice.id}`); };

  return { onBack, onRowClick, onDetail, onEdit };
};
