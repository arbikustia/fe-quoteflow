import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { QuotationDetailState } from "../Quotation.type";

import { useGetAllItemsQuery } from "@/services/master-item.service";
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
// eslint-disable-next-line max-lines-per-function
export const useQuotationDetail = (): QuotationDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useGetQuotationByIdQuery(id ?? "", {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });
  const { data: itemResponse } = useGetAllItemsQuery();
  const [approveQuotation, { isLoading: isApproving }] = useApproveQuotationMutation();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const quotation = data?.status && data.data ? data.data : null;
  const itemCategories = useMemo(
    (): Map<string, string> => new Map(
      itemResponse?.status
        ? itemResponse.data.map((item): [string, string] => [item.id, item.category_name ?? "Uncategorized"])
        : [],
    ),
    [itemResponse],
  );
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
   * Open order form in transaction edit mode.
   * @returns {void} No return value
   */
  const handleEdit = (): void => {
    if (!quotation || quotation.status !== 1) return;

    void navigate(`/order/create/${quotation.transaction_id}`, {
      state: { returnUrl: `/document/quotation/${id ?? quotation.id}` },
    });
  };

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

  return { quotation, itemCategories, isLoading, isApproving, isConfirmOpen, errorMessage, goBack, openApproveModal, closeApproveModal, handleEdit, handleApprove };
};
