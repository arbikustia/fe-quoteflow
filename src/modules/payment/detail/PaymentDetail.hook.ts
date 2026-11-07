import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { PaymentData, PaymentDetailState } from "../Payment.type";

import {
  mapPaymentSummary,
  useGetAllInvoicesQuery,
  useGetPaymentByIdQuery,
} from "@/services/payment.service";

/**
 * Manage payment detail state.
 * @returns {PaymentDetailState} Payment detail state
 */
// eslint-disable-next-line max-lines-per-function
export const usePaymentDetail = (): PaymentDetailState => {
  const navigate = useNavigate();
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

  /**
   * Navigate back to payment list.
   * @returns {void}
   */
  const goBack = (): void => {
    void navigate("/document/payment");
  };

  /**
   * Navigate to payment edit page.
   * @returns {void}
   */
  const handleEdit = (): void => {
    if (!id || !payment) return;

    void navigate(`/document/payment/${id}/edit`, { state: payment });
  };

  /**
   * Navigate to payment status page.
   * @returns {void}
   */
  const handleStatus = (): void => {
    if (!id || !payment) return;

    void navigate(`/document/payment/${id}/status`, { state: payment });
  };

  return {
    payment,
    paymentEntries,
    linkedInvoice,
    methodName: paymentEntries[0]?.payment_method_name ?? payment?.paymentMethodId,
    isLoading: isLoading && !payment,
    errorMessage,
    goBack,
    handleEdit,
    handleStatus,
  };
};
