import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constant/endpoint.const";
import type { ApiPayment, PaymentCreatePayload, PaymentCreateResponse, PaymentData, PaymentDetailResponse, PaymentInvoiceListResponse, PaymentListParams, PaymentListResponse, PaymentMethodListResponse } from "@/modules/payment/Payment.type";

/** Map API payment model to table row. */
export const mapPayment = (payment: ApiPayment): PaymentData => ({
  id: payment.id,
  invoiceId: payment.invoice_id,
  paymentMethodId: payment.payment_method_id,
  invoiceNo: payment.invoice?.invoice_no ?? "-",
  customerName: payment.invoice?.customer.name ?? "-",
  amount: payment.amount,
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
