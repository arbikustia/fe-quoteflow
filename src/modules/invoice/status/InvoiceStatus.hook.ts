import type { SyntheticEvent } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { InvoiceStatusFormProps, InvoiceStatusSubmitState } from "./InvoiceStatus.type";

import { useGetInvoiceByIdQuery, useUpdateInvoiceMutation } from "@/services/invoice.service";

/**
 * Resolve active status from selection or invoice.
 * @param {boolean | null} selectedStatus - Selected status
 * @param {boolean} isInvoiceActive - Invoice status derived flag
 * @returns {boolean} Active status
 */
const _resolveActiveStatus = (selectedStatus: boolean | null, isInvoiceActive: boolean): boolean =>
  selectedStatus ?? isInvoiceActive;

/**
 * Manage invoice status submission.
 * @param {boolean} isActive - Target active status
 * @param {string} transactionId - Transaction ID for payload
 * @param {string} [id] - Invoice ID
 * @returns {InvoiceStatusSubmitState} - Submission state and submit handler
 */
const useInvoiceStatusSubmit = (
  isActive: boolean,
  transactionId: string,
  id?: string,
): InvoiceStatusSubmitState => {
  const navigate = useNavigate();
  const [updateInvoice, { isLoading: isSubmitting }] = useUpdateInvoiceMutation();
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  /**
   * Submit invoice status update.
   * @param {SyntheticEvent<HTMLFormElement>} event - Form submit event
   * @returns {Promise<void>} Completion promise
   */
  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!id) {
      setSubmissionError("Invoice data is unavailable.");

      return;
    }

    setSubmissionError(null);

    try {
      const response = await updateInvoice({
        id,
        payload: { transaction_id: transactionId, status: isActive ? 1 : 0 },
      }).unwrap();

      if (!response.status) {
        setSubmissionError(response.messages.join(" ") || "Unable to update invoice status.");

        return;
      }

      void navigate("/document/invoice", { state: { successMessage: "Invoice status updated successfully." } });
    } catch {
      setSubmissionError("Unable to update invoice status.");
    }
  };

  return { isSubmitting, submissionError, handleSubmit };
};

/**
 * Manage invoice status form state.
 * @returns {InvoiceStatusFormProps} Status form state
 */
export const useInvoiceStatusForm = (): InvoiceStatusFormProps => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetInvoiceByIdQuery(id ?? "", { skip: !id });
  const invoice = data?.status && data.data ? data.data : null;
  const [selectedStatus, setSelectedStatus] = useState<boolean | null>(null);
  const isActive = _resolveActiveStatus(selectedStatus, invoice ? invoice.status === 1 : true);
  const transactionId = invoice?.quotation?.transaction?.id
    ?? invoice?.quotation?.transaction_id
    ?? invoice?.transaction_id
    ?? "";
  const submit = useInvoiceStatusSubmit(isActive, transactionId, id);
  const missingDataError = id && invoice ? null : "Invoice data is unavailable.";

  /**
   * Handle invoice status change.
   * @param {boolean} checked - New active status
   * @returns {void} No return value
   */
  const handleStatusChange = (checked: boolean): void => setSelectedStatus(checked);

  /**
   * Navigate back to invoice list.
   * @returns {void} No return value
   */
  const goBack = (): void => { void navigate("/document/invoice"); };

  return {
    invoiceNumber: invoice?.invoice_no ?? null,
    isActive,
    isLoading,
    isSubmitting: submit.isSubmitting,
    errorMessage: submit.submissionError ?? missingDataError,
    handleStatusChange,
    handleSubmit: submit.handleSubmit,
    goBack,
  };
};
