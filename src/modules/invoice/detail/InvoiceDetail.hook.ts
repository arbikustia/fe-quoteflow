import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { ApiInvoice, InvoiceDetailState } from "../Invoice.type";

import { useApproveInvoiceMutation, useGetInvoiceByIdQuery } from "@/services/invoice.service";

/**
 * Resolve transaction ID from invoice.
 * Supports both nested quotation transaction format and top-level invoice format.
 * @param {ApiInvoice} invoice - Invoice data
 * @returns {string} Transaction ID
 */
const _resolveTransactionId = (invoice: ApiInvoice): string =>
  invoice.quotation?.transaction?.id ?? invoice.quotation?.transaction_id ?? invoice.transaction_id ?? "";

/**
 * Resolve invoice detail error message.
 * @param {boolean} hasError - Query error state
 * @param {boolean} isMissingData - Missing response data state
 * @returns {string | null} Error message
 */
const _resolveErrorMessage = (hasError: boolean, isMissingData: boolean): string | null => {
  if (hasError) return "Unable to load invoice detail.";

  if (isMissingData) return "Invoice detail is unavailable.";

  return null;
};

/**
 * Load invoice detail and expose navigation.
 * @returns {InvoiceDetailState} - invoice detail state
 */
// eslint-disable-next-line max-lines-per-function
export const useInvoiceDetail = (): InvoiceDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useGetInvoiceByIdQuery(id ?? "", {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });
  const [approveInvoice, { isLoading: isApproving }] = useApproveInvoiceMutation();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const invoice = data?.status && data.data ? data.data : null;
  const errorMessage = submissionError ?? _resolveErrorMessage(Boolean(error), Boolean(data && !data.status));

  /**
   * Navigate back from invoice detail.
   * @returns {void} - no return value
   */
  const goBack = (): void => { void navigate(-1); };

  /**
   * Open approval confirmation.
   * @returns {void} No return value
   */
  const openApproveModal = (): void => setIsConfirmOpen(true);

  /**
   * Close approval confirmation.
   * @returns {void} No return value
   */
  const closeApproveModal = (): void => setIsConfirmOpen(false);

  /**
   * Open order form in transaction edit mode.
   * @returns {void} No return value
   */
  const handleEdit = (): void => {
    if (!invoice || invoice.status !== 1) return;

    const transactionId = _resolveTransactionId(invoice);

    if (!transactionId) return;

    void navigate(`/order/create/${transactionId}`, {
      state: { returnUrl: `/document/invoice/${id ?? invoice.id}` },
    });
  };

  /**
   * Approve current invoice.
   * @returns {Promise<void>} Completion promise
   */
  const handleApprove = async (): Promise<void> => {
    if (!id || !invoice) return;

    setSubmissionError(null);

    try {
      const response = await approveInvoice({
        id: invoice.id ?? id,
      }).unwrap();

      if (!response.status) {
        setSubmissionError(response.messages?.join(" ") || "Unable to approve invoice.");

        return;
      }

      closeApproveModal();
      void navigate("/document/invoice");
    } catch {
      setSubmissionError("Unable to approve invoice.");
    }
  };

  return {
    invoice,
    isLoading,
    isApproving,
    isConfirmOpen,
    errorMessage,
    goBack,
    goEdit: handleEdit,
    handleEdit,
    openApproveModal,
    closeApproveModal,
    handleApprove,
  };
};
