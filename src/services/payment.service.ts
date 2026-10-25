import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constant/endpoint.const";
import type { ApiPayment, PaymentCreatePayload, PaymentCreateResponse, PaymentData, PaymentInvoiceListResponse, PaymentListParams, PaymentListResponse, PaymentMethodListResponse } from "@/modules/payment/Payment.type";

/** Map API payment model to table row. */
export const mapPayment = (payment: ApiPayment): PaymentData => ({
  id: payment.id,
  invoiceId: payment.invoice_id,
  paymentMethodId: payment.payment_method_id,
  amount: payment.amount,
  paidAt: payment.paid_at,
  referenceNo: payment.reference_no,
  notes: payment.notes,
  status: payment.status === 1 ? "active" : "inactive",
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

export const { useGetPaymentsQuery, useGetAllInvoicesQuery, useGetAllPaymentMethodsQuery, useCreatePaymentMutation, useUpdatePaymentMutation } = paymentService;
