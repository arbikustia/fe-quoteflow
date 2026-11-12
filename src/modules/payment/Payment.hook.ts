import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { PaymentData, PaymentNavigation, PaymentPagination } from "./Payment.type";

import { mapPaymentSummary, useGetPaymentsQuery } from "@/services/payment.service";

/**
 * Fetch payments and expose paginated list state.
 * @returns {PaymentPagination} - pagination state
 */
export const usePaymentPagination = (): PaymentPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTermState] = useState("");
  const query = useGetPaymentsQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const response = query.data;
  const isMissingData = !query.isLoading && !query.error && !response;
  const isEnvelopeError = Boolean(response && !response.status);
  const paginatedData = response?.status ? response.data.map(mapPaymentSummary) : [];
  const totalPages = response?.status ? Math.max(1, response.total_pages) : 1;
  const totalCount = response?.status ? response.total_count : 0;
  let errorMessage: string | null = null;

  if (query.error) errorMessage = "Unable to load payments.";

  if (isMissingData) errorMessage = "No response received from server.";

  if (isEnvelopeError) errorMessage = "Payment data is unavailable.";

  /**
   * Go to a page bounded by the total page count.
   * @param {number} page - Requested page number
   * @returns {void} - Nothing
   */
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  /**
   * Change the page size and reset to the first page.
   * @param {number} size - Requested page size
   * @returns {void} - Nothing
   */
  const changePageSize = (size: number): void => { setPageSize(size); setCurrentPage(1); };
  /**
   * Set the search term and reset to the first page.
   * @param {string} value - Search term
   * @returns {void} - Nothing
   */
  const setSearchTerm = (value: string): void => { setSearchTermState(value); setCurrentPage(1); };

  return {
    currentPage: Math.min(currentPage, totalPages), totalPages, pageSize, paginatedData, totalCount,
    isLoading: query.isLoading, errorMessage, isMissingData, isEmpty: !query.isLoading && !errorMessage && paginatedData.length === 0,
    goToPage, changePageSize, setSearchTerm,
  };
};

/**
 * Provide payment page navigation.
 * @returns {PaymentNavigation} - Navigation callbacks
 */
export const usePaymentNavigation = (): PaymentNavigation => {
  const navigate = useNavigate();
  /**
   * Navigate back to the document menu.
   * @returns {void} - Nothing
   */
  const onBack = (): void => { void navigate("/document"); };
  /**
   * Navigate to the payment create form.
   * @returns {void} - Nothing
   */
  const onCreate = (): void => { void navigate("/document/payment/create"); };
  /**
   * Navigate to the payment detail.
   * @param {PaymentData} payment - Selected payment
   * @returns {void} - Nothing
   */
  const onDetail = (payment: PaymentData): void => { void navigate(`/document/payment/${payment.invoiceNo}`, { state: payment }); };
  /**
   * Open the detail of the clicked payment row.
   * @param {PaymentData} payment - Selected payment
   * @returns {void} - Nothing
   */
  const onRowClick = (payment: PaymentData): void => { onDetail(payment); };

  return { onBack, onCreate, onDetail, onRowClick };
};
