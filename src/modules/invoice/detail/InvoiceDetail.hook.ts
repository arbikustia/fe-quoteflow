import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { ApiInvoice, InvoiceApprovalState, InvoiceDetailState } from "../Invoice.type";

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
 * Manage invoice approval flow.
 * @param {ApiInvoice | null} invoice - Invoice detail
 * @param {string} [id] - Route invoice ID
 * @returns {InvoiceApprovalState} - Approval state and callbacks
 */
const useInvoiceApproval = (
  invoice: ApiInvoice | null,
  id?: string,
): InvoiceApprovalState => {
  const navigate = useNavigate();
  const [approveInvoice, { isLoading: isApproving }] = useApproveInvoiceMutation();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

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
   * Approve current invoice.
   * @returns {Promise<void>} Completion promise
   */
  const handleApprove = async (): Promise<void> => {
    if (!id || !invoice) return;

    setSubmissionError(null);

    try {
      const response = await approveInvoice({ id: invoice.id || id }).unwrap();

      if (!response.status) {
        setSubmissionError(response.messages.join(" ") || "Unable to approve invoice.");

        return;
      }

      setIsConfirmOpen(false);
      void navigate("/document/invoice");
    } catch {
      setSubmissionError("Unable to approve invoice.");
    }
  };

  return { isApproving, isConfirmOpen, submissionError, openApproveModal, closeApproveModal, handleApprove };
};

/**
 * Load invoice detail and expose navigation.
 * @returns {InvoiceDetailState} - invoice detail state
 */
export const useInvoiceDetail = (): InvoiceDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useGetInvoiceByIdQuery(id ?? "", { skip: !id, refetchOnMountOrArgChange: true });
  const invoice = data?.status && data.data ? data.data : null;
  const approval = useInvoiceApproval(invoice, id);
  const queryError = _resolveErrorMessage(Boolean(error), Boolean(data && !data.status));

  /**
   * Navigate back from invoice detail.
   * @returns {void} - no return value
   */
  const goBack = (): void => { void navigate(-1); };

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

  return {
    invoice,
    isLoading,
    isApproving: approval.isApproving,
    isConfirmOpen: approval.isConfirmOpen,
    errorMessage: approval.submissionError ?? queryError,
    goBack,
    handleEdit,
    openApproveModal: approval.openApproveModal,
    closeApproveModal: approval.closeApproveModal,
    handleApprove: approval.handleApprove,
  };
};
