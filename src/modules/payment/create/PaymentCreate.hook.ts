import type { SyntheticEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { PaymentCreateFormState, PaymentCreatePayload, PaymentData } from "../Payment.type";

import { formatPaymentPaidAt, validateRequiredPaymentFields } from "./PaymentCreate.helpers";

import { useCreatePaymentMutation, useGetAllInvoicesQuery, useGetAllPaymentMethodsQuery, useUpdatePaymentMutation } from "@/services/payment.service";

/**
 * Normalize payment payload date.
 * @param {PaymentCreatePayload} payload - Raw payment payload
 * @returns {PaymentCreatePayload} Normalized payment payload
 */
const _buildPayload = (payload: PaymentCreatePayload): PaymentCreatePayload => ({
  ...payload,
  paid_at: formatPaymentPaidAt(payload.paid_at),
});

/**
 * Validate payment submission values.
 * @param {PaymentCreatePayload} values - Payment values
 * @param {string} referenceNo - Reference number
 * @returns {string | null} Validation message
 */
const _validatePayload = (values: PaymentCreatePayload, referenceNo: string): string | null =>
  validateRequiredPaymentFields({
    invoiceId: values.invoice_id,
    paymentMethodId: values.payment_method_id,
    status: String(values.status),
    amount: values.amount,
    paidAt: values.paid_at,
    referenceNo,
  });

/**
 * Manage payment form submission.
 * @param {string} [id] - Payment ID for edit mode
 * @returns {{isSubmitting: boolean; errorMessage: string | null; submit: (values: PaymentCreatePayload, referenceNo: string) => Promise<string | null>}} Submission state
 */
const usePaymentSubmit = (id?: string): {
  isSubmitting: boolean;
  errorMessage: string | null;
  submit: (values: PaymentCreatePayload, referenceNo: string) => Promise<string | null>;
} => {
  const [createPayment, { isLoading: isCreating }] = useCreatePaymentMutation();
  const [updatePayment, { isLoading: isUpdating }] = useUpdatePaymentMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  /**
   * Submit payment payload.
   * @param {PaymentCreatePayload} values - Payment payload
   * @param {string} referenceNo - Payment reference number
   * @returns {Promise<string | null>} Error message when failed
   */
  const submit = async (values: PaymentCreatePayload, referenceNo: string): Promise<string | null> => {
    setErrorMessage(null);
    const validationMessage = _validatePayload(values, referenceNo);

    if (validationMessage) {
      setErrorMessage(validationMessage);

      return validationMessage;
    }

    const payload = _buildPayload(values);

    try {
      const response = id ? await updatePayment({ id, ...payload }).unwrap() : await createPayment(payload).unwrap();

      if (!response.status) {
        const message = response.messages.join(" ") || "Payment request failed.";

        setErrorMessage(message);

        return message;
      }

      return null;
    } catch {
      const message = id ? "Unable to update payment. Please try again." : "Unable to create payment. Please try again.";

      setErrorMessage(message);

      return message;
    }
  };

  return { isSubmitting: isCreating || isUpdating, errorMessage, submit };
};

/**
 * Manage create and edit payment form state.
 * @returns {PaymentCreateFormState} - payment form state
 */
export const usePaymentCreate = (): PaymentCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const routePayment = location.state as PaymentData | null;
  const invoiceQuery = useGetAllInvoicesQuery(); const paymentMethodQuery = useGetAllPaymentMethodsQuery(); const submission = usePaymentSubmit(id);
  const [invoiceId, setInvoiceId] = useState(routePayment?.invoiceId ?? "");
  const [paymentMethodId, setPaymentMethodId] = useState(routePayment?.paymentMethodId ?? "");
  const [status, setStatus] = useState<string>(routePayment?.paymentStatus ? String(routePayment.paymentStatus) : "");
  const [amount, setAmountState] = useState<number | null>(routePayment?.amount ?? null);
  const [paidAt, setPaidAt] = useState(routePayment?.paidAt ? routePayment.paidAt.slice(0, 16) : "");
  const [referenceNo, setReferenceNo] = useState(routePayment?.referenceNo ?? "");
  const [notes, setNotes] = useState(routePayment?.notes ?? "");
  const [isActive, setIsActive] = useState(routePayment?.status === "active");
  const [isSubmitted] = useState(false); const invoices = invoiceQuery.data?.status ? invoiceQuery.data.data : [];
  const paymentMethods = paymentMethodQuery.data?.status ? paymentMethodQuery.data.data : []; const isEditMode = Boolean(id);
  /**
   * Set payment amount.
   * @param {number | null} value - Amount
   * @returns {void} No return value
   */
  const setAmount = (value: number | null): void => setAmountState(value);
  /** Return to previous page. @returns {void} No return value */
  const goBack = (): void => { void navigate(-1); };
  /**
   * Change payment status.
   * @param {boolean} value - Selected status
   * @returns {void} No return value
   */
  const handleStatusChange = (value: boolean): void => setIsActive(value);

  /**
   * Submit payment form.
   * @param {SyntheticEvent} event - form submit event
   * @returns {Promise<void>} - completed request
   */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();

    if (amount === null) return;

    const error = await submission.submit({
      invoice_id: invoiceId,
      payment_method_id: paymentMethodId,
      status: Number(status),
      amount,
      paid_at: paidAt,
      notes,
    }, referenceNo);

    if (error) return;

    void navigate("/document/payment", { state: { successMessage: isEditMode ? "Payment updated successfully." : "Payment created successfully." } });
  };

  return { id, isEditMode, isActive, invoices, paymentMethods, invoiceId, paymentMethodId, status, amount, paidAt, referenceNo, notes, isLoadingOptions: invoiceQuery.isLoading || paymentMethodQuery.isLoading, isSubmitting: submission.isSubmitting, errorMessage: submission.errorMessage, isSubmitted, handleSubmit, setInvoiceId, setPaymentMethodId, setStatus, setAmount, setPaidAt, setReferenceNo, setNotes, goBack, handleStatusChange };
};
