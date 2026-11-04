import { useLocation, useNavigate, useParams } from "react-router-dom";

import { MOCK_PAYMENT_RESPONSE } from "@/fixture/payments";

import type { PaymentData, PaymentDetailState } from "../Payment.type";

import {
  mapPayment,
  useGetAllInvoicesQuery,
  useGetAllPaymentMethodsQuery,
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

  const { data, error, isLoading } = useGetPaymentByIdQuery(id ?? "", {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const invoiceQuery = useGetAllInvoicesQuery();
  const paymentMethodQuery = useGetAllPaymentMethodsQuery();

  const apiPayment = data?.status && data.data ? mapPayment(data.data) : null;
  const fixtureMatch = MOCK_PAYMENT_RESPONSE.data.find((item) => item.id === id);
  const fixturePayment = fixtureMatch ? mapPayment(fixtureMatch) : null;
  const payment = apiPayment ?? initialPayment ?? fixturePayment;

  const linkedInvoice = invoiceQuery.data?.status && payment
    ? invoiceQuery.data.data.find((item) => item.id === payment.invoiceId || item.invoice_no === payment.invoiceId)
    : null;

  const linkedMethod = paymentMethodQuery.data?.status && payment
    ? paymentMethodQuery.data.data.find((item) => item.id === payment.paymentMethodId || item.name === payment.paymentMethodId)
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
    linkedInvoice,
    methodName: linkedMethod?.name ?? payment?.paymentMethodId,
    isLoading: isLoading && !payment,
    errorMessage,
    goBack,
    handleEdit,
    handleStatus,
  };
};
