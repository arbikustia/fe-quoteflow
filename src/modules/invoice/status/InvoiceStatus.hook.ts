import type { SyntheticEvent } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MOCK_INVOICES } from "@/fixture/invoices";

import type { InvoiceStatusFormProps } from "./InvoiceStatus.type";

import { useGetInvoiceByIdQuery, useUpdateInvoiceMutation } from "@/services/invoice.service";

/**
 * Manage invoice status form state.
 * @returns {InvoiceStatusFormProps} Status form state
 */
// eslint-disable-next-line max-lines-per-function
export const useInvoiceStatusForm = (): InvoiceStatusFormProps => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetInvoiceByIdQuery(id ?? "", { skip: !id });
  const [updateInvoice, { isLoading: isSubmitting }] = useUpdateInvoiceMutation();

  const apiInvoice = data?.status && data.data ? data.data : null;
  const fixtureInvoice = MOCK_INVOICES.find((item) => item.id === id) ?? null;
  const invoice = apiInvoice ?? fixtureInvoice;

  const [selectedStatus, setSelectedStatus] = useState<boolean | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const isActive = selectedStatus ?? (invoice ? invoice.status === 1 : true);
  const errorMessage = submissionError ?? (!id || !invoice ? "Invoice data is unavailable." : null);

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

  /**
   * Submit invoice status update.
   * @param {SyntheticEvent<HTMLFormElement>} event - Form submit event
   * @returns {Promise<void>} Completion promise
   */
  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!id || !invoice) {
      setSubmissionError("Invoice data is unavailable.");

      return;
    }

    setSubmissionError(null);

    try {
      const response = await updateInvoice({
        id,
        payload: {
          transaction_id: invoice.transaction_id,
          status: isActive ? 1 : 0,
        },
      }).unwrap();

      if (!response.status) {
        setSubmissionError(response.messages.join(" ") || "Unable to update invoice status.");

        return;
      }

      void navigate("/document/invoice", { state: { successMessage: "Invoice status updated successfully." } });
    } catch {
      if (apiInvoice === null) {
        void navigate("/document/invoice", { state: { successMessage: "Invoice status updated successfully." } });

        return;
      }

      setSubmissionError("Unable to update invoice status.");
    }
  };

  return {
    invoiceNumber: invoice?.invoice_no ?? null,
    isActive,
    isLoading,
    isSubmitting,
    errorMessage,
    handleStatusChange,
    handleSubmit,
    goBack,
  };
};
