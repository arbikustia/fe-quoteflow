import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constants/endpoint.constant";

import type { ApiPayment, ApiPaymentSummary, PaymentCreatePayload, PaymentCreateResponse, PaymentData, PaymentDetailResponse, PaymentInvoiceListResponse, PaymentListParams, PaymentListResponse, PaymentMethodListResponse } from "@/modules/payment/Payment.type";

/**
 * Map an invoice payment summary to a table row.
 * @param {ApiPaymentSummary} summary - Payment summary per invoice
 * @returns {PaymentData} Table row
 */
export const mapPaymentSummary = (summary: ApiPaymentSummary): PaymentData => {
  const lastPayment = summary.payments?.at(-1);

  return {
    id: summary.invoice_id,
    invoiceId: summary.invoice_id,
    paymentMethodId: lastPayment?.payment_method_id ?? "",
    invoiceNo: summary.invoice_no,
    customerName: summary.customer_name,
    amount: summary.total_paid ?? 0,
    paidAt: lastPayment?.paid_at ?? "",
    referenceNo: "",
    notes: lastPayment?.notes ?? "",
    status: summary.remaining_amount > 0 ? "inactive" : "active",
    statusLabel: summary.status,
    grandTotal: summary.grand_total,
    remainingAmount: summary.remaining_amount,
    createdAt: "",
  };
};

/**
 * Map API payment model to table row.
 * @param {ApiPayment} payment - API payment
 * @returns {PaymentData} Table row
 */
export const mapPayment = (payment: ApiPayment): PaymentData => ({
  id: payment.id,
  invoiceId: payment.invoice_id,
  paymentMethodId: payment.payment_method_id,
  invoiceNo: payment.invoice?.invoice_no ?? "-",
  customerName: payment.invoice?.customer?.name ?? "-",
  amount: payment.amount ?? 0,
  paidAt: payment.paid_at,
  referenceNo: payment.reference_no,
  notes: payment.notes,
  status: payment.status === 1 ? "active" : "inactive",
  paymentStatus: payment.status,
  createdAt: payment.created_at,
});

export const paymentService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<PaymentListResponse, PaymentListParams>({
      query: (params) => ({
        url: ENDPOINT.PAYMENT.PAGED,
        method: "GET",
        params: { PageNumber: params.pageNumber, PageSize: params.pageSize, SearchTerm: params.searchTerm },
      }),
      providesTags: ["Payment"],
    }),
    getAllInvoices: builder.query<PaymentInvoiceListResponse, void>({
      query: () => ({ url: ENDPOINT.INVOICE.ALL, method: "GET" }),
    }),
    getAllPaymentMethods: builder.query<PaymentMethodListResponse, void>({
      query: () => ({ url: ENDPOINT.MASTER_PAYMENT_METHOD.ALL, method: "GET" }),
    }),
    getPaymentById: builder.query<PaymentDetailResponse, string>({
      query: (id) => ({ url: `${ENDPOINT.PAYMENT.DETAIL}/${id}`, method: "GET" }),
      providesTags: ["Payment"],
    }),
    createPayment: builder.mutation<PaymentCreateResponse, PaymentCreatePayload>({
      query: (body) => ({ url: ENDPOINT.PAYMENT.CREATE, method: "POST", data: body }),
      invalidatesTags: ["Payment"],
    }),
    updatePayment: builder.mutation<PaymentCreateResponse, PaymentCreatePayload & { id: string }>({
      query: ({ id, ...body }) => ({ url: `${ENDPOINT.PAYMENT.DETAIL}/${id}`, method: "PUT", data: body }),
      invalidatesTags: ["Payment"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetPaymentsQuery, useGetPaymentByIdQuery, useGetAllInvoicesQuery, useGetAllPaymentMethodsQuery, useCreatePaymentMutation, useUpdatePaymentMutation } = paymentService;
