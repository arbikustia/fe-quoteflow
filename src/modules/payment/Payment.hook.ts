import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { PaymentData, PaymentPagination, PaymentProps } from "./Payment.type";

import { mapPayment, useGetPaymentsQuery } from "@/services/payment.service";

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
  const paginatedData = response?.status ? response.data.map(mapPayment) : [];
  const totalPages = response?.status ? Math.max(1, response.total_pages) : 1;
  const totalCount = response?.status ? response.total_count : 0;
  let errorMessage: string | null = null;

  if (query.error) errorMessage = "Unable to load payments.";

  if (isMissingData) errorMessage = "No response received from server.";

  if (isEnvelopeError) errorMessage = "Payment data is unavailable.";

  /**
   *
   * @param {number} page - page number
   * @returns {void} - changes page
   */
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, totalPages)));
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
    currentPage: Math.min(currentPage, totalPages), totalPages, pageSize, paginatedData, totalCount,
    isLoading: query.isLoading, errorMessage, isMissingData, isEmpty: !query.isLoading && !errorMessage && paginatedData.length === 0,
    goToPage, changePageSize, setSearchTerm,
  };
};

/**
 * Provide payment page navigation.
 * @returns {Pick<PaymentProps, "onBack" | "onCreate" | "onEdit" | "onDetail" | "onRowClick">} - navigation callbacks
 */
export const usePaymentNavigation = (): Pick<PaymentProps, "onBack" | "onCreate" | "onEdit" | "onDetail" | "onRowClick"> => {
  const navigate = useNavigate();
  /**
   *
   */
  const onBack = (): void => { void navigate("/document"); };
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
  const onDetail = (payment: PaymentData): void => { void navigate(`/document/payment/${payment.id}`, { state: payment }); };
  /**
   *
   * @param {PaymentData} payment - payment
   */
  const onRowClick = (payment: PaymentData): void => { onDetail(payment); };

  return { onBack, onCreate, onEdit, onDetail, onRowClick };
};
