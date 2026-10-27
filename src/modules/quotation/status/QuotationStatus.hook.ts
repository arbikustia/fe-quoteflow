import type { SyntheticEvent } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { QuotationStatusFormProps } from "./QuotationStatus.type";

import { useGetQuotationByIdQuery, useUpdateQuotationMutation } from "@/services/quotation.service";

/**
 * Resolve quotation query error.
 * @param {string | undefined} id - Quotation ID
 * @param {boolean} hasError - Query error state
 * @param {boolean} hasInvalidData - Invalid response state
 * @returns {string | null} Query error message
 */
const _getQueryError = (id: string | undefined, hasError: boolean, hasInvalidData: boolean): string | null => {
  if (!id) return "Quotation ID is unavailable.";

  if (hasError || hasInvalidData) return "Unable to load quotation data.";

  return null;
};

/**
 * Manage quotation status form state.
 * @returns {QuotationStatusFormProps} Status form state
 */
// eslint-disable-next-line max-lines-per-function
export const useQuotationStatusForm = (): QuotationStatusFormProps => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useGetQuotationByIdQuery(id ?? "", { skip: !id });
  const [updateQuotation, { isLoading: isSubmitting }] = useUpdateQuotationMutation();
  const quotation = data?.status && data.data ? data.data : null;
  const [selectedStatus, setSelectedStatus] = useState<boolean | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const isActive = selectedStatus ?? quotation?.status === 1;
  const queryError = _getQueryError(id, Boolean(error), Boolean(data && (!data.status || !data.data)));
  const errorMessage = submissionError ?? queryError;

  /**
   * Handle quotation status change.
   * @param {boolean} checked - New active status
   * @returns {void} No return value
   */
  const handleStatusChange = (checked: boolean): void => setSelectedStatus(checked);

  /**
   * Navigate back to quotation list.
   * @returns {void} No return value
   */
  const goBack = (): void => { void navigate("/document/quotation"); };

  /**
   * Submit quotation status update.
   * @param {FormEvent<HTMLFormElement>} event - Form submit event
   * @returns {Promise<void>} Completion promise
   */
  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!id || !quotation) {
      setSubmissionError("Quotation data is unavailable.");

      return;
    }

    setSubmissionError(null);

    try {
      const response = await updateQuotation({
        id,
        payload: {
          transaction_id: quotation.transaction_id,
          quotation_no: quotation.quotation_no,
          quotation_date: quotation.quotation_date,
          expired_at: quotation.expired_at,
          notes: quotation.notes,
          status: isActive ? 1 : 0,
        },
      }).unwrap();

      if (!response.status) {
        setSubmissionError(response.messages.join(" ") || "Unable to update quotation status.");

        return;
      }

      void navigate("/document/quotation", { state: { successMessage: "Quotation status updated successfully." } });
    } catch {
      setSubmissionError("Unable to update quotation status.");
    }
  };

  return {
    quotationNumber: quotation?.quotation_no ?? null,
    isActive,
    isLoading,
    isSubmitting,
    errorMessage,
    handleStatusChange,
    handleSubmit,
    goBack,
  };
};
