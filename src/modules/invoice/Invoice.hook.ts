import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MOCK_INVOICES } from "@/fixture/invoices";

import type { InvoiceData, InvoicePageData, InvoicePagination } from "./Invoice.type";

import { mapInvoice, useGetInvoicesQuery } from "@/services/invoice.service";

/**
 * Filter invoice fixtures by searchable invoice fields.
 * @param {string} searchTerm - Search query
 * @returns {InvoiceData[]} Filtered invoice rows
 */
const _getFixtureInvoices = (searchTerm: string): InvoiceData[] => {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const invoices = MOCK_INVOICES.map(mapInvoice);

  if (!normalizedSearchTerm) {
    return invoices;
  }

  return invoices.filter((invoice) => [invoice.invoiceNumber, invoice.customerName, invoice.name].some((value) => value.toLowerCase().includes(normalizedSearchTerm)));
};

/**
 * Derive invoice rows from API or temporary fixture backup.
 * @param {ReturnType<typeof useGetInvoicesQuery>} query - Invoice query
 * @param {string} searchTerm - Search term
 * @param {number} currentPage - Current page
 * @param {number} pageSize - Page size
 * @returns {InvoicePageData} Invoice page data
 */
const _getInvoicePageData = (
  query: ReturnType<typeof useGetInvoicesQuery>,
  searchTerm: string,
  currentPage: number,
  pageSize: number,
): InvoicePageData => {
  const response = query.data;
  const apiInvoices = response?.data ?? [];
  const hasApiRecords = Boolean(response?.status && apiInvoices.length > 0);
  const invoiceRows = hasApiRecords ? apiInvoices.map(mapInvoice) : _getFixtureInvoices(searchTerm);
  const totalPages = Math.max(1, Math.ceil(invoiceRows.length / pageSize));
  const boundedCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (boundedCurrentPage - 1) * pageSize;

  return {
    paginatedData: hasApiRecords ? invoiceRows : invoiceRows.slice(startIndex, startIndex + pageSize),
    totalPages: hasApiRecords ? response?.total_pages ?? totalPages : totalPages,
    totalCount: hasApiRecords ? response?.total_count ?? invoiceRows.length : invoiceRows.length,
  };
};

/**
 * Fetch invoices and expose list state.
 * API remains primary source; fixture is intentional temporary backup until invoice API returns records.
 * @returns {InvoicePagination} Invoice pagination state
 */
export const useInvoicePagination = (): InvoicePagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTermState] = useState("");
  const query = useGetInvoicesQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const pageData = _getInvoicePageData(query, searchTerm, currentPage, pageSize);
  const boundedCurrentPage = Math.min(currentPage, pageData.totalPages);
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
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, pageData.totalPages)));

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
   * Edit invoice status.
   * @param {InvoiceData} invoice - Selected invoice
   * @returns {void} No return value
   */
  const onEdit = (invoice: InvoiceData): void => { void navigate(`/document/invoice/${invoice.id}/status`); };

  return { onBack, onRowClick, onDetail, onEdit };
};
