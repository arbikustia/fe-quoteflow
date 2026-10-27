import type { SyntheticEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { PaymentData } from "../Payment.type";

import type { PaymentStatusFormProps } from "./PaymentStatus.type";

import { useUpdatePaymentMutation } from "@/services/payment.service";

/**
 * Manage payment status form state.
 * @returns {PaymentStatusFormProps} Status form state
 */
// eslint-disable-next-line max-lines-per-function
export const usePaymentStatusForm = (): PaymentStatusFormProps => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const payment = location.state as PaymentData | null;
  const [updatePayment, { isLoading: isSubmitting }] = useUpdatePaymentMutation();
  const [selectedStatus, setSelectedStatus] = useState<boolean | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const isActive = selectedStatus ?? (payment ? payment.status === "active" : true);
  const errorMessage = submissionError ?? (!id || !payment ? "Payment data is unavailable." : null);

  /**
   * Handle payment status change.
   * @param {boolean} checked - New active status
   * @returns {void} No return value
   */
  const handleStatusChange = (checked: boolean): void => setSelectedStatus(checked);

  /**
   * Navigate back to payment list.
   * @returns {void} No return value
   */
  const goBack = (): void => { void navigate("/document/payment"); };

  /**
   * Submit payment status update.
   * @param {SyntheticEvent<HTMLFormElement>} event - Form submit event
   * @returns {Promise<void>} Completion promise
   */
  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!id || !payment) {
      setSubmissionError("Payment data is unavailable.");

      return;
    }

    setSubmissionError(null);

    try {
      const response = await updatePayment({
        id,
        invoice_id: payment.invoiceId,
        payment_method_id: payment.paymentMethodId,
        amount: payment.amount,
        paid_at: payment.paidAt,
        reference_no: payment.referenceNo,
        notes: payment.notes,
        status: isActive ? 1 : 0,
      }).unwrap();

      if (!response.status) {
        setSubmissionError(response.messages.join(" ") || "Unable to update payment status.");

        return;
      }

      void navigate("/document/payment", { state: { successMessage: "Payment status updated successfully." } });
    } catch {
      setSubmissionError("Unable to update payment status.");
    }
  };

  return { referenceNo: payment?.referenceNo ?? null, isActive, isLoading: false, isSubmitting, errorMessage, handleStatusChange, handleSubmit, goBack };
};
