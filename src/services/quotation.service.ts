import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constant/endpoint.const";
import type {
  ApiQuotation,
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
  name: quotation.transaction.event_name,
  customerPhone: quotation.transaction.customer_phone,
  location: quotation.transaction.address,
  startDate: quotation.transaction.start_at,
  endDate: quotation.transaction.end_at,
  grandTotal: quotation.transaction.grand_total,
  status: quotation.status,
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
  }),
  overrideExisting: false,
});

export const {
  useGetQuotationsQuery,
  useGetQuotationByIdQuery,
  useUpdateQuotationMutation,
} = quotationService;
