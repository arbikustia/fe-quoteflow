import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MOCK_PAYMENT_RESPONSE } from "@/fixture/payments";

import type { PaymentData, PaymentPagination } from "./Payment.type";

import { mapPayment, useGetPaymentsQuery } from "@/services/payment.service";

/**
 * Filter payment fixtures by searchable payment fields.
 * @param {string} searchTerm - Search query
 * @returns {PaymentData[]} Filtered payment rows
 */
const _getFixturePayments = (searchTerm: string): PaymentData[] => {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const payments = MOCK_PAYMENT_RESPONSE.data.map(mapPayment);

  if (!normalizedSearchTerm) {
    return payments;
  }

  return payments.filter((payment) => [payment.referenceNo, payment.invoiceId, payment.paymentMethodId, payment.notes].some((value) => value.toLowerCase().includes(normalizedSearchTerm)));
};

/**
 * Resolve payment rows from API or fixture backup.
 * @param {ReturnType<typeof useGetPaymentsQuery>} query - Payment query
 * @param {string} searchTerm - Search query
 * @param {number} currentPage - Current page
 * @param {number} pageSize - Page size
 * @returns {{payments: PaymentData[]; totalPages: number; totalCount: number; isUsingFixture: boolean}} Payment page data
 */
const _getPaymentPageData = (
  query: ReturnType<typeof useGetPaymentsQuery>,
  searchTerm: string,
  currentPage: number,
  pageSize: number,
): { payments: PaymentData[]; totalPages: number; totalCount: number; isUsingFixture: boolean } => {
  const response = query.data;
  const apiPayments = response?.data ?? [];
  const isUsingFixture = Boolean(response?.status && apiPayments.length === 0);
  const payments = isUsingFixture ? _getFixturePayments(searchTerm) : apiPayments.map(mapPayment);
  const totalPages = Math.max(1, Math.ceil(payments.length / pageSize));
  const boundedPage = Math.min(currentPage, totalPages);
  const startIndex = (boundedPage - 1) * pageSize;

  return {
    payments: isUsingFixture ? payments.slice(startIndex, startIndex + pageSize) : payments,
    totalPages: isUsingFixture ? totalPages : response?.total_pages ?? totalPages,
    totalCount: isUsingFixture ? payments.length : response?.total_count ?? payments.length,
    isUsingFixture,
  };
};


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
  const pageData = _getPaymentPageData(query, searchTerm, currentPage, pageSize);
  const isMissingData = !query.isLoading && !query.error && !response;
  const isEnvelopeError = Boolean(response && !response.status);
  const paginatedData = pageData.payments;
  let errorMessage: string | null = null;

  if (query.error) errorMessage = "Unable to load payments.";

  if (isMissingData) errorMessage = "No response received from server.";

  if (isEnvelopeError) errorMessage = "Payment data is unavailable.";

  /**
   *
   * @param {number} page - page number
   * @returns {void} - changes page
   */
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, pageData.totalPages)));
  /**
   *
   * @param {number} size - page size
   */
  const changePageSize = (size: number): void => { setPageSize(size); setCurrentPage(1); };
  /**
   *
   * @param {string} value - value
   */
  const setSearchTerm = (value: string): void => { setSearchTermState(value); setCurrentPage(1); };

  return {
    currentPage: Math.min(currentPage, pageData.totalPages), totalPages: pageData.totalPages, pageSize, paginatedData, totalCount: pageData.totalCount,
    isLoading: query.isLoading, errorMessage, isMissingData, isEmpty: !query.isLoading && !errorMessage && paginatedData.length === 0,
    goToPage, changePageSize, setSearchTerm,
  };
};

/**
 * Provide payment page navigation.
 * @returns {{onBack: () => void; onCreate: () => void; onEdit: (payment: PaymentData) => void; onRowClick: (payment: PaymentData) => void}} - navigation callbacks
 */
export const usePaymentNavigation = (): { onBack: () => void; onCreate: () => void; onEdit: (payment: PaymentData) => void; onRowClick: (payment: PaymentData) => void } => {
  const navigate = useNavigate();
  /**
   *
   */
  const onBack = (): void => { void navigate(-1); };
  /**
   *
   */
  const onCreate = (): void => { void navigate("/document/payment/create"); };
  /**
   *
   * @param {PaymentData} payment - payment
   */
  const onEdit = (payment: PaymentData): void => { void navigate(`/document/payment/${payment.id}/edit`, { state: payment }); };
  /**
   *
   * @param {PaymentData} payment - payment
   */
  const onRowClick = (payment: PaymentData): void => { onEdit(payment); };

  return { onBack, onCreate, onEdit, onRowClick };
};
