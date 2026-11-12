import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { PaymentData, PaymentDetailState } from "../Payment.type";

import {
  mapPaymentSummary,
  useGetAllInvoicesQuery,
  useGetPaymentByIdQuery,
} from "@/services/payment.service";

/**
 * Manage payment detail navigation.
 * @param {PaymentData | null} payment - Payment data
 * @param {string} [id] - Payment ID
 * @returns {Pick<PaymentDetailState, "goBack" | "handleStatus">} Navigation handlers
 */
const usePaymentDetailNavigation = (
  payment: PaymentData | null,
  id?: string,
): Pick<PaymentDetailState, "goBack" | "handleStatus"> => {
  const navigate = useNavigate();

  /** Navigate back. @returns {void} No return value */
  const goBack = (): void => { void navigate("/document/payment"); };
  /** Navigate to status. @returns {void} No return value */
  const handleStatus = (): void => {
    if (id && payment) void navigate(`/document/payment/${id}/status`, { state: payment });
  };

  return { goBack, handleStatus };
};

/**
 * Manage payment detail state.
 * @returns {PaymentDetailState} Payment detail state
 */
export const usePaymentDetail = (): PaymentDetailState => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const routeState = location.state as { payment?: PaymentData } | PaymentData | null;
  const initialPayment = routeState && "id" in routeState ? routeState : routeState?.payment ?? null;

  const invoiceNo = id ?? "";
  const { data, error, isLoading } = useGetPaymentByIdQuery(invoiceNo, {
    skip: !invoiceNo,
    refetchOnMountOrArgChange: true,
  });

  const invoiceQuery = useGetAllInvoicesQuery();

  const summary = data?.status ? data.data : null;
  const apiPayment = summary ? mapPaymentSummary(summary) : null;
  const payment = apiPayment ?? initialPayment;
  const paymentEntries = summary?.payments ?? [];

  const linkedInvoice = invoiceQuery.data?.status && payment
    ? invoiceQuery.data.data.find((item) => item.id === payment.invoiceId || item.invoice_no === payment.invoiceNo)
    : null;

  let errorMessage: string | null = null;

  if (!isLoading && !payment) {
    errorMessage = error ? "Unable to load payment detail." : "Payment detail is unavailable.";
  }

  const navigation = usePaymentDetailNavigation(payment, id);

  return {
    payment,
    paymentEntries,
    linkedInvoice,
    methodName: paymentEntries[0]?.payment_method_name ?? payment?.paymentMethodId,
    isLoading: isLoading && !payment,
    errorMessage,
    goBack: navigation.goBack,
    handleStatus: navigation.handleStatus,
  };
};
