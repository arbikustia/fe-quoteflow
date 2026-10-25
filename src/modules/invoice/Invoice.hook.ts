import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { mapInvoice, useGetInvoicesQuery, useUpdateInvoiceMutation } from "@/services/invoice.service";

import type { InvoiceData, InvoicePagination, InvoiceStatusState } from "./Invoice.type";

/** Fetch invoices and expose list state. */
export const useInvoicePagination = (): InvoicePagination => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTermState] = useState("");
  const query = useGetInvoicesQuery({ pageNumber: currentPage, pageSize, searchTerm });
  const response = query.data;
  const paginatedData = response?.status && response.data ? response.data.map(mapInvoice) : [];
  let errorMessage: string | null = null;

  if (query.isError) {
    errorMessage = "Unable to load invoices.";
  } else if (response && !response.status) {
    errorMessage = "Invoice data is unavailable.";
  }
  const setSearchTerm = (value: string): void => { setSearchTermState(value); setCurrentPage(1); };
  const goToPage = (page: number): void => setCurrentPage(Math.max(1, Math.min(page, response?.total_pages ?? 1)));
  const changePageSize = (size: number): void => { setPageSize(size); setCurrentPage(1); };

  return {
    currentPage, pageSize, paginatedData, totalPages: response?.total_pages ?? 0, totalCount: response?.total_count ?? 0,
    isLoading: query.isLoading, isEmpty: !query.isLoading && !errorMessage && paginatedData.length === 0,
    errorMessage, setSearchTerm, goToPage, changePageSize,
  };
};

/** Update invoice status and expose notification state. */
export const useInvoiceStatus = (): InvoiceStatusState => {
  const [updateInvoice] = useUpdateInvoiceMutation();
  const [updatingInvoiceId, setUpdatingInvoiceId] = useState<string | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<"success" | "error">("success");
  const closeNotification = (): void => setNotificationMessage(null);

  const updateStatus = async (invoice: InvoiceData, isActive: boolean): Promise<void> => {
    setUpdatingInvoiceId(invoice.id);
    setNotificationMessage(null);

    try {
      await updateInvoice({ id: invoice.id, payload: { transaction_id: invoice.transactionId, status: isActive ? 1 : 0 } }).unwrap();
      setNotificationType("success");
      setNotificationMessage("Invoice status updated successfully.");
    } catch {
      setNotificationType("error");
      setNotificationMessage("Unable to update invoice status.");
    } finally {
      setUpdatingInvoiceId(null);
    }
  };

  return { updatingInvoiceId, notificationMessage, notificationType, updateStatus, closeNotification };
};

/** Provide invoice navigation. */
export const useInvoiceNavigation = (): { onBack: () => void; onRowClick: (invoice: InvoiceData) => void; onDetail: (invoice: InvoiceData) => void } => {
  const navigate = useNavigate();
  const onBack = (): void => { void navigate(-1); };
  const onDetail = (invoice: InvoiceData): void => { void navigate(`/document/invoice/${invoice.id}`); };
  const onRowClick = (invoice: InvoiceData): void => onDetail(invoice);

  return { onBack, onRowClick, onDetail };
};