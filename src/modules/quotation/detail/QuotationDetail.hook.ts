import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { QuotationDetailState } from "../Quotation.type";

import { useApproveQuotationMutation, useGetQuotationByIdQuery } from "@/services/quotation.service";

/**
 * Resolve quotation detail error message.
 * @param {boolean} hasError - Query error state
 * @param {boolean} isMissingData - Missing response data state
 * @returns {string | null} Error message
 */
const _resolveErrorMessage = (hasError: boolean, isMissingData: boolean): string | null => {
  if (hasError) return "Unable to load quotation detail.";

  if (isMissingData) return "Quotation detail is unavailable.";

  return null;
};

/**
 * Manage quotation detail state.
 * @returns {QuotationDetailState} Quotation detail state
 */
export const useQuotationDetail = (): QuotationDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useGetQuotationByIdQuery(id ?? "", { skip: !id });
  const [approveQuotation, { isLoading: isApproving }] = useApproveQuotationMutation();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const quotation = data?.status && data.data ? data.data : null;
  const errorMessage = submissionError ?? _resolveErrorMessage(Boolean(error), Boolean(data && !data.status));

  /**
   * Navigate to previous page.
   * @returns {void} No return value
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
   * Approve current quotation.
   * @returns {Promise<void>} Completion promise
   */
  const handleApprove = async (): Promise<void> => {
    if (!id || !quotation) return;

    setSubmissionError(null);

    try {
      const response = await approveQuotation({ id }).unwrap();

      if (!response.status) {
        setSubmissionError(response.messages.join(" ") || "Unable to approve quotation.");

        return;
      }

      closeApproveModal();
      void navigate("/document/invoice");
    } catch {
      setSubmissionError("Unable to approve quotation.");
    }
  };

  return { quotation, isLoading, isApproving, isConfirmOpen, errorMessage, goBack, openApproveModal, closeApproveModal, handleApprove };
};
