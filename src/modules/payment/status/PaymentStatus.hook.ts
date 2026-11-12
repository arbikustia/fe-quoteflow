import type { SyntheticEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { formatPaymentPaidAt } from "../create/PaymentCreate.util";
import type { PaymentData } from "../Payment.type";

import type { PaymentStatusFormProps, PaymentStatusSubmitState, PaymentStatusUpdatePayload } from "./PaymentStatus.type";

import { useUpdatePaymentMutation } from "@/services/payment.service";

const UPDATE_ERROR = "Unable to update payment status.";

/**
 * Build the update payload that keeps the payment fields and only changes its status.
 * @param {PaymentData} payment - Payment data
 * @param {string} id - Payment ID
 * @param {boolean} isActive - Target active status
 * @returns {PaymentStatusUpdatePayload} - Update payload
 */
const _buildStatusPayload = (payment: PaymentData, id: string, isActive: boolean): PaymentStatusUpdatePayload => ({
  id,
  invoice_id: payment.invoiceId,
  payment_method_id: payment.paymentMethodId,
  amount: payment.amount,
  paid_at: formatPaymentPaidAt(payment.paidAt),
  reference_no: payment.referenceNo,
  notes: payment.notes,
  status: isActive ? 1 : 0,
});

/**
 * Manage payment status submission.
 * @param {PaymentData | null} payment - Payment data
 * @param {string} [id] - Payment ID
 * @returns {PaymentStatusSubmitState} - Submission state and submit function
 */
const usePaymentStatusSubmit = (
  payment: PaymentData | null,
  id?: string,
): PaymentStatusSubmitState => {
  const [updatePayment, { isLoading: isSubmitting }] = useUpdatePaymentMutation();
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  /**
   * Submit payment status update.
   * @param {boolean} isActive - Target active status
   * @returns {Promise<string | null>} Error message when failed
   */
  const submit = async (isActive: boolean): Promise<string | null> => {
    setSubmissionError(null);

    if (!id || !payment) {
      setSubmissionError("Payment data is unavailable.");

      return "Payment data is unavailable.";
    }

    try {
      const response = await updatePayment(_buildStatusPayload(payment, id, isActive)).unwrap();
      const message = response.status ? null : response.messages.join(" ") || UPDATE_ERROR;

      setSubmissionError(message);

      return message;
    } catch {
      setSubmissionError(UPDATE_ERROR);

      return UPDATE_ERROR;
    }
  };

  return { isSubmitting, submissionError, submit };
};

/**
 * Manage payment status form state.
 * @returns {PaymentStatusFormProps} Status form state
 */
export const usePaymentStatusForm = (): PaymentStatusFormProps => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const payment = location.state as PaymentData | null;
  const [selectedStatus, setSelectedStatus] = useState<boolean | null>(null);
  const isActive = selectedStatus ?? (payment ? payment.status === "active" : true);
  const submission = usePaymentStatusSubmit(payment, id);
  const missingDataError = id && payment ? null : "Payment data is unavailable.";
  const errorMessage = submission.submissionError ?? missingDataError;

  /**
   * Handle payment status change.
   * @param {boolean} checked - New active status
   * @returns {void} No return value
   */
  const handleStatusChange = (checked: boolean): void => setSelectedStatus(checked);

  /**
   * Navigate back to the payment list.
   * @returns {void} - Nothing
   */
  const goBack = (): void => { void navigate("/document/payment"); };

  /**
   * Submit payment status update.
   * @param {SyntheticEvent<HTMLFormElement>} event - Form submit event
   * @returns {Promise<void>} Completion promise
   */
  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const error = await submission.submit(isActive);

    if (error) return;

    void navigate("/document/payment", { state: { successMessage: "Payment status updated successfully." } });
  };

  return {
    referenceNo: payment?.referenceNo ?? null,
    isActive,
    isLoading: false,
    isSubmitting: submission.isSubmitting,
    errorMessage,
    handleStatusChange,
    handleSubmit,
    goBack,
  };
};
