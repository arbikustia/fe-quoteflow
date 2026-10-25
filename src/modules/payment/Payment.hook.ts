import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { mapPayment, useGetPaymentsQuery } from "@/services/payment.service";

import type { PaymentData, PaymentPagination } from "./Payment.type";

/** Fetch payments and expose paginated list state. */
export const usePaymentPagination = (): PaymentPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTermState] = useState("");
  const query = useGetPaymentsQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const response = query.data;
  const isMissingData = !query.isLoading && !query.error && !response;
  const isEnvelopeError = Boolean(response && !response.status);
  const paginatedData = response?.status && response.data ? response.data.map(mapPayment) : [];
  let errorMessage: string | null = null;

  if (query.error) errorMessage = "Unable to load payments.";
  if (isMissingData) errorMessage = "No response received from server.";
  if (isEnvelopeError) errorMessage = "Payment data is unavailable.";

  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, response?.total_pages ?? 1)));
  const changePageSize = (size: number): void => { setPageSize(size); setCurrentPage(1); };
  const setSearchTerm = (value: string): void => { setSearchTermState(value); setCurrentPage(1); };

  return {
    currentPage, totalPages: response?.total_pages ?? 0, pageSize, paginatedData, totalCount: response?.total_count ?? 0,
    isLoading: query.isLoading, errorMessage, isMissingData, isEmpty: !query.isLoading && !errorMessage && paginatedData.length === 0,
    goToPage, changePageSize, setSearchTerm,
  };
};

/** Provide payment page navigation. */
export const usePaymentNavigation = (): { onBack: () => void; onCreate: () => void; onEdit: (payment: PaymentData) => void; onRowClick: (payment: PaymentData) => void } => {
  const navigate = useNavigate();
  const onBack = (): void => { void navigate(-1); };
  const onCreate = (): void => { void navigate("/document/payment/create"); };
  const onEdit = (payment: PaymentData): void => { void navigate(`/document/payment/${payment.id}/edit`, { state: payment }); };
  const onRowClick = (payment: PaymentData): void => { onEdit(payment); };

  return { onBack, onCreate, onEdit, onRowClick };
};
