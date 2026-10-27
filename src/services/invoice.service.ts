import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constant/endpoint.const";
import type { ApiInvoice, InvoiceData, InvoiceDetailResponse, InvoiceListParams, InvoiceListResponse, InvoiceUpdateRequest, InvoiceUpdateResponse } from "@/modules/invoice/Invoice.type";

/** Map API invoice to table row. */
export const mapInvoice = (invoice: ApiInvoice): InvoiceData => ({
  id: invoice.id,
  transactionId: invoice.transaction_id,
  invoiceNumber: invoice.invoice_no,
  invoiceDate: invoice.invoice_date,
  dueDate: invoice.due_date,
  customerName: invoice.quotation.transaction.customer_name,
  name: invoice.quotation.transaction.event_name,
  customerPhone: invoice.quotation.transaction.customer_phone,
  location: invoice.quotation.transaction.address,
  startDate: invoice.quotation.transaction.start_at,
  endDate: invoice.quotation.transaction.end_at,
  grandTotal: invoice.quotation.transaction.grand_total,
  status: invoice.status,
  notes: invoice.notes,
});

export const invoiceService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getInvoices: builder.query<InvoiceListResponse, InvoiceListParams>({
      query: (params) => ({
        url: ENDPOINT.INVOICE.PAGED,
        method: "GET",
        params: { PageNumber: params.pageNumber, PageSize: params.pageSize, SearchTerm: params.searchTerm },
      }),
      providesTags: ["Invoice"],
    }),
    getInvoiceById: builder.query<InvoiceDetailResponse, string>({
      query: (id) => ({ url: `${ENDPOINT.INVOICE.DETAIL}/${id}`, method: "GET" }),
      providesTags: ["Invoice"],
    }),
    updateInvoice: builder.mutation<InvoiceUpdateResponse, InvoiceUpdateRequest>({
      query: ({ id, payload }) => ({ url: `${ENDPOINT.INVOICE.DETAIL}/${id}`, method: "PUT", data: payload }),
      invalidatesTags: ["Invoice"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetInvoicesQuery, useGetInvoiceByIdQuery, useUpdateInvoiceMutation } = invoiceService;

export const useGetAllInvoicesQuery = invoiceService.endpoints.getInvoices.useQuery;
