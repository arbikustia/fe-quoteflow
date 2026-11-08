import type { SyntheticEvent } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { QuotationUpdateResponse } from "../Quotation.type";

import type { QuotationStatusFormProps } from "./QuotationStatus.type";

import { useApproveQuotationMutation, useGetQuotationByIdQuery } from "@/services/quotation.service";

/**
 * Resolve quotation query error.
 * @param {string} [id] - Quotation ID
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
 * Resolve validation error before submitting quotation status.
 * @param {string} [id] - Quotation ID
 * @param {boolean} hasQuotation - Quotation presence
 * @param {boolean} isApproved - Approval state
 * @returns {string | null} Validation error message
 */
const _getSubmitError = (id: string | undefined, hasQuotation: boolean, isApproved: boolean): string | null => {
  if (!id || !hasQuotation) return "Quotation data is unavailable.";

  if (!isApproved) return "Approve this quotation before submitting.";

  return null;
};

/**
 * Extract response error message.
 * @param {QuotationUpdateResponse} response - Update response
 * @returns {string | null} Response error message
 */
const _getResponseError = (response: QuotationUpdateResponse): string | null => {
  if (response.status) return null;

  return response.messages.join(" ") || "Unable to update quotation status.";
};

/**
 * Submit quotation approval request.
 * @param {string} id - Quotation ID
 * @param {(args: { id: string }) => { unwrap: () => Promise<QuotationUpdateResponse> }} approveQuotation - Approval mutation trigger
 * @returns {Promise<string | null>} Response error message
 */
const _submitApproval = async (
  id: string,
  approveQuotation: (args: { id: string }) => { unwrap: () => Promise<QuotationUpdateResponse> },
): Promise<string | null> => {
  const response = await approveQuotation({ id }).unwrap();

  return _getResponseError(response);
};

/**
 * Manage quotation status submission.
 * @param {boolean} hasQuotation - Quotation presence
 * @param {boolean} isApproved - Approval state
 * @param {string} [id] - Quotation ID
 * @returns {{errorMessage: string | null; isSubmitting: boolean; handleSubmit: (event: SyntheticEvent<HTMLFormElement>) => Promise<void>}} Submission state
 */
const useQuotationStatusSubmit = (
  hasQuotation: boolean,
  isApproved: boolean,
  id?: string,
): Pick<QuotationStatusFormProps, "errorMessage" | "isSubmitting" | "handleSubmit"> => {
  const navigate = useNavigate();
  const [approveQuotation, { isLoading: isSubmitting }] = useApproveQuotationMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Submit status update.
   * @param {SyntheticEvent<HTMLFormElement>} event - Submit event
   * @returns {Promise<void>} Completion promise
   */
  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const validationError = _getSubmitError(id, hasQuotation, isApproved);

    if (validationError || !id) {
      setErrorMessage(validationError);

      return;
    }

    try {
      const responseError = await _submitApproval(id, approveQuotation);

      setErrorMessage(responseError);

      if (!responseError) void navigate("/document/invoice", { state: { successMessage: "Quotation approved successfully." } });
    } catch {
      setErrorMessage("Unable to update quotation status.");
    }
  };

  return { errorMessage, isSubmitting, handleSubmit };
};

/**
 * Manage quotation status form state.
 * @returns {QuotationStatusFormProps} Status form state
 */
export const useQuotationStatusForm = (): QuotationStatusFormProps => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, error, isLoading } = useGetQuotationByIdQuery(id ?? "", { skip: !id });
  const quotation = data?.status && data.data ? data.data : null;
  const [selectedStatus, setSelectedStatus] = useState<boolean | null>(null);
  const isApproved = selectedStatus ?? quotation?.status === 2;
  const submitState = useQuotationStatusSubmit(Boolean(quotation), isApproved, id);
  const queryError = _getQueryError(id, Boolean(error), Boolean(data && (!data.status || !data.data)));

  /**
   * Change approval selection.
   * @param {boolean} checked - Approval state
   * @returns {void} No return value
   */
  const handleStatusChange = (checked: boolean): void => setSelectedStatus(checked);
  /**
   * Navigate to quotation list.
   * @returns {void} No return value
   */
  const goBack = (): void => { void navigate("/document/quotation"); };

  return {
    quotationNumber: quotation?.quotation_no ?? null,
    isApproved,
    isLoading,
    isSubmitting: submitState.isSubmitting,
    errorMessage: submitState.errorMessage ?? queryError,
    handleStatusChange,
    handleSubmit: submitState.handleSubmit,
    goBack,
  };
};
