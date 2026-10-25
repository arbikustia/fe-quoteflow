import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { mapQuotation, useGetQuotationsQuery, useUpdateQuotationMutation } from "@/services/quotation.service";

import type {
  QuotationData,
  QuotationListApiState,
  QuotationListResponse,
  QuotationNavigation,
  QuotationPagination,
  QuotationStatusState,
} from "./Quotation.type";

/** Create quotation API state without records. */
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

/** Derive explicit quotation list state from API query. */
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

/** Fetch quotation list and expose pagination state. */
export const useQuotationPagination = (): QuotationPagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTermState] = useState("");
  const query = useGetQuotationsQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const state = _deriveListState(query);
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, state.totalPages)));
  const changePageSize = (size: number): void => { setPageSize(size); setCurrentPage(1); };
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

/** Update quotation status and expose row request state. */
export const useQuotationStatus = (): QuotationStatusState => {
  const [updateQuotation] = useUpdateQuotationMutation();
  const [updatingQuotationId, setUpdatingQuotationId] = useState<string | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<"success" | "error">("success");
  const closeNotification = (): void => setNotificationMessage(null);

  /** Submit status change. */
  const updateStatus = async (quotation: QuotationData, isActive: boolean): Promise<void> => {
    setUpdatingQuotationId(quotation.id);
    setNotificationMessage(null);

    try {
      await updateQuotation({
        id: quotation.id,
        payload: { transaction_id: quotation.transactionId, status: isActive ? 1 : 0 },
      }).unwrap();
      setNotificationType("success");
      setNotificationMessage("Quotation status updated successfully.");
    } catch {
      setNotificationType("error");
      setNotificationMessage("Unable to update quotation status.");
    } finally {
      setUpdatingQuotationId(null);
    }
  };

  return { updatingQuotationId, notificationMessage, notificationType, updateStatus, closeNotification };
};

/** Provide quotation navigation handlers. */
export const useQuotationNavigation = (): QuotationNavigation => {
  const navigate = useNavigate();
  const onBack = (): void => { void navigate(-1); };
  const onEdit = (quotation: QuotationData): void => { void navigate(`/order/edit/${quotation.transactionId}`); };
  const onDetail = (quotation: QuotationData): void => { void navigate(`/document/quotation/${quotation.id}`); };
  const onRowClick = (quotation: QuotationData): void => { void navigate(`/document/quotation/${quotation.id}`); };

  return { onBack, onEdit, onDetail, onRowClick };
};
