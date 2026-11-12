import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constants/endpoint.constant";
import type {
  ApiQuotation,
  QuotationAllResponse,
  QuotationApproveRequest,
  QuotationData,
  QuotationDetailResponse,
  QuotationListParams,
  QuotationListResponse,
  QuotationUpdateRequest,
  QuotationUpdateResponse,
} from "@/modules/quotation/Quotation.type";

const QUOTATION_TAG = "Quotation";

/**
 * Map API quotation entity to UI row model.
 * @param {ApiQuotation} quotation - API quotation
 * @returns {QuotationData} Mapped UI model
 */
export const mapQuotation = (quotation: ApiQuotation): QuotationData => ({
  id: quotation.id,
  transactionId: quotation.transaction_id,
  quotationNumber: quotation.quotation_no,
  customerName: quotation.transaction.customer_name,
  name: quotation.transaction.event_name,
  quotationDate: quotation.quotation_date,
  customerPhone: quotation.transaction.customer_phone,
  location: quotation.transaction.address,
  startDate: quotation.transaction.start_at,
  endDate: quotation.transaction.end_at,
  grandTotal: quotation.transaction.grand_total,
  status: quotation.status,
  items: quotation.transaction.rental_transaction_items,
});

export const quotationService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getQuotations: builder.query<QuotationListResponse, QuotationListParams>({
      query: (params) => ({
        url: ENDPOINT.QUOTATION.PAGED,
        method: "GET",
        params: {
          PageNumber: params.pageNumber,
          PageSize: params.pageSize,
          SearchTerm: params.searchTerm,
        },
      }),
      providesTags: [QUOTATION_TAG],
    }),
    getQuotationOptions: builder.query<QuotationAllResponse, void>({
      query: () => ({
        url: ENDPOINT.QUOTATION.ALL,
        method: "GET",
      }),
      providesTags: [QUOTATION_TAG],
    }),
    getQuotationById: builder.query<QuotationDetailResponse, string>({
      query: (id) => ({
        url: `${ENDPOINT.QUOTATION.DETAIL}/${id}`,
        method: "GET",
      }),
      providesTags: [QUOTATION_TAG],
    }),
    updateQuotation: builder.mutation<QuotationUpdateResponse, QuotationUpdateRequest>({
      query: ({ id, payload }) => ({
        url: `${ENDPOINT.QUOTATION.DETAIL}/${id}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [QUOTATION_TAG],
    }),
    approveQuotation: builder.mutation<QuotationUpdateResponse, QuotationApproveRequest>({
      query: ({ id }) => ({
        url: `${ENDPOINT.QUOTATION.STATUS}/${id}/status`,
        method: "PATCH",
        data: { status: 2 },
      }),
      invalidatesTags: [QUOTATION_TAG, "Invoice", "Order"], // Approval creates an invoice and changes the order status.
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetQuotationsQuery,
  useGetQuotationOptionsQuery,
  useGetQuotationByIdQuery,
  useLazyGetQuotationByIdQuery,
  useUpdateQuotationMutation,
  useApproveQuotationMutation,
} = quotationService;
