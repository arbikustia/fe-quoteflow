import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useItemCategories } from "../Quotation.hook";
import type { QuotationApprovalState, QuotationDetailState } from "../Quotation.type";

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
 * Manage quotation approval confirmation.
 * @param {string} [id] - Quotation ID
 * @returns {QuotationApprovalState} - Approval state
 */
const useQuotationApproval = (id?: string): QuotationApprovalState => {
  const navigate = useNavigate();
  const [approveQuotation, { isLoading: isApproving }] = useApproveQuotationMutation();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  /**
   * Open confirmation.
   * @returns {void} No return value
   */
  const openConfirm = (): void => setIsConfirmOpen(true);
  /**
   * Close confirmation.
   * @returns {void} No return value
   */
  const closeConfirm = (): void => setIsConfirmOpen(false);

  /**
   * Approve the quotation and go to invoices.
   * @returns {Promise<void>} - Completion promise
   */
  const approve = async (): Promise<void> => {
    if (!id) return;

    setErrorMessage(undefined);

    try {
      const response = await approveQuotation({ id }).unwrap();

      if (!response.status) {
        setErrorMessage(response.messages.join(" ") || "Unable to approve quotation.");

        return;
      }

      setIsConfirmOpen(false);
      void navigate("/document/invoice");
    } catch {
      setErrorMessage("Unable to approve quotation.");
    }
  };

  return { isApproving, isConfirmOpen, errorMessage, openConfirm, closeConfirm, approve };
};

/**
 * Manage quotation detail state.
 * @returns {QuotationDetailState} Quotation detail state
 */
export const useQuotationDetail = (): QuotationDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useGetQuotationByIdQuery(id ?? "", { skip: !id, refetchOnMountOrArgChange: true });
  const itemCategories = useItemCategories();
  const approval = useQuotationApproval(id);
  const quotation = data?.status && data.data ? data.data : null;
  const queryError = _resolveErrorMessage(Boolean(error), Boolean(data && !data.status));

  /**
   * Navigate back.
   * @returns {void} - No return value
   */
  const goBack = (): void => { void navigate(-1); };

  /**
   * Navigate to the order edit form.
   * @returns {void} - No return value
   */
  const handleEdit = (): void => {
    if (!quotation || quotation.status !== 1) return;

    void navigate(`/order/create/${quotation.transaction_id}`, { state: { returnUrl: `/document/quotation/${id ?? quotation.id}`, quotationId: quotation.id } });
  };

  return {
    quotation,
    itemCategories,
    isLoading,
    isApproving: approval.isApproving,
    isConfirmOpen: approval.isConfirmOpen,
    errorMessage: approval.errorMessage ?? queryError,
    goBack,
    openApproveModal: approval.openConfirm,
    closeApproveModal: approval.closeConfirm,
    handleEdit,
    handleApprove: approval.approve,
  };
};
