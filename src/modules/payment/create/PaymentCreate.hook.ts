import type { SyntheticEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useCreatePaymentMutation, useGetAllInvoicesQuery, useGetAllPaymentMethodsQuery, useUpdatePaymentMutation } from "@/services/payment.service";

import type { PaymentCreateFormState, PaymentData } from "../Payment.type";

/** Manage create and edit payment form state. */
export const usePaymentCreate = (): PaymentCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const routePayment = location.state as PaymentData | null;
  const invoiceQuery = useGetAllInvoicesQuery();
  const paymentMethodQuery = useGetAllPaymentMethodsQuery();
  const [createPayment, { isLoading: isCreating }] = useCreatePaymentMutation();
  const [updatePayment, { isLoading: isUpdating }] = useUpdatePaymentMutation();
  const [invoiceId, setInvoiceId] = useState(routePayment?.invoiceId ?? "");
  const [paymentMethodId, setPaymentMethodId] = useState(routePayment?.paymentMethodId ?? "");
  const [amount, setAmountState] = useState(routePayment?.amount ?? 0);
  const [paidAt, setPaidAt] = useState(routePayment?.paidAt ? routePayment.paidAt.slice(0, 16) : "");
  const [referenceNo, setReferenceNo] = useState(routePayment?.referenceNo ?? "");
  const [notes, setNotes] = useState(routePayment?.notes ?? "");
  const [isActive, setIsActive] = useState(routePayment?.status === "active");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const invoices = invoiceQuery.data?.status ? invoiceQuery.data.data : [];
  const paymentMethods = paymentMethodQuery.data?.status ? paymentMethodQuery.data.data : [];
  const isEditMode = Boolean(id);
  const setAmount = (value: number | null): void => setAmountState(value ?? 0);
  const goBack = (): void => { void navigate(-1); };
  const handleStatusChange = (value: boolean): void => setIsActive(value);

  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);

    if (!invoiceId || !paymentMethodId || amount <= 0 || !paidAt || !referenceNo.trim()) {
      setErrorMessage("Complete all required payment fields.");

      return;
    }

    const status = isEditMode && !isActive ? 0 : 1;
    const payload = { invoice_id: invoiceId, payment_method_id: paymentMethodId, amount, paid_at: new Date(paidAt).toISOString(), reference_no: referenceNo, notes, status };

    try {
      const response = isEditMode && id ? await updatePayment({ id, ...payload }).unwrap() : await createPayment(payload).unwrap();

      if (!response.status) {
        setErrorMessage(response.messages.join(" ") || "Payment request failed.");

        return;
      }

      void navigate("/document/payment", { state: { successMessage: isEditMode ? "Payment updated successfully." : "Payment created successfully." } });
    } catch {
      setErrorMessage(isEditMode ? "Unable to update payment. Please try again." : "Unable to create payment. Please try again.");
    }
  };

  return { id, isEditMode, isActive, invoices, paymentMethods, invoiceId, paymentMethodId, amount, paidAt, referenceNo, notes, isLoadingOptions: invoiceQuery.isLoading || paymentMethodQuery.isLoading, isSubmitting: isCreating || isUpdating, errorMessage, handleSubmit, setInvoiceId, setPaymentMethodId, setAmount, setPaidAt, setReferenceNo, setNotes, goBack, handleStatusChange };
};
