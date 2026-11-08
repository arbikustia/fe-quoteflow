import type { SyntheticEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { formatPaymentPaidAt } from "../create/PaymentCreate.helpers";
import type { PaymentData } from "../Payment.type";

import type { PaymentStatusFormProps } from "./PaymentStatus.type";

import { useUpdatePaymentMutation } from "@/services/payment.service";

/**
 * Manage payment status submission.
 * @param {PaymentData | null} payment - Payment data
 * @param {string} [id] - Payment ID
 * @returns {{isSubmitting: boolean; submissionError: string | null; submit: (isActive: boolean) => Promise<string | null>}} Submission state
 */
const usePaymentStatusSubmit = (
  payment: PaymentData | null,
  id?: string,
): { isSubmitting: boolean; submissionError: string | null; submit: (isActive: boolean) => Promise<string | null> } => {
  const [updatePayment, { isLoading: isSubmitting }] = useUpdatePaymentMutation(); const [submissionError, setSubmissionError] = useState<string | null>(null);

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
      const response = await updatePayment({
        id,
        invoice_id: payment.invoiceId,
        payment_method_id: payment.paymentMethodId,
        amount: payment.amount,
        paid_at: formatPaymentPaidAt(payment.paidAt),
        reference_no: payment.referenceNo,
        notes: payment.notes,
        status: isActive ? 1 : 0,
      }).unwrap();

      if (!response.status) {
        const message = response.messages.join(" ") || "Unable to update payment status.";

        setSubmissionError(message);

        return message;
      }

      return null;
    } catch {
      setSubmissionError("Unable to update payment status.");

      return "Unable to update payment status.";
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

  /** Navigate back to payment list. @returns {void} No return value */
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
