import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { generateInvoicePDF } from "@/utils/pdfGenerator";

import type { InvoiceData, InvoiceNavigation, InvoicePageData, InvoicePagination } from "./Invoice.type";
import { invoiceToQuoteData } from "./Invoice.util";

import { mapInvoice, useGetInvoicesQuery, useLazyGetInvoiceByIdQuery } from "@/services/invoice.service";

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
  const errorMessage = query.isError ? "Unable to load invoices." : undefined;

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
 * Provide invoice navigation and list actions.
 * @returns {InvoiceNavigation} Invoice callbacks
 */
export const useInvoiceNavigation = (): InvoiceNavigation => {
  const navigate = useNavigate();
  const [getInvoice] = useLazyGetInvoiceByIdQuery();

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
   * Navigate to order form edit for edit action.
   * @param {InvoiceData} invoice - Selected invoice
   * @returns {void} No return value
   */
  const onEdit = (invoice: InvoiceData): void => {
    const targetId = invoice.transactionId || invoice.id;

    void navigate(`/order/create/${targetId}`, {
      state: { returnUrl: "/document/invoice" },
    });
  };

  /**
   * Download invoice using complete detail data.
   * @param {InvoiceData} invoice - Selected invoice
   * @returns {Promise<void>} Completion promise
   */
  const onDownload = async (invoice: InvoiceData): Promise<void> => {
    const response = await getInvoice(invoice.id).unwrap();

    if (response.data) {
      generateInvoicePDF(invoiceToQuoteData(response.data));
    }
  };

  return { onBack, onRowClick, onDetail, onEdit, onDownload };
};
