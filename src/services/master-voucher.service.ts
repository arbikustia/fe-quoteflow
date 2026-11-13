import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constants/endpoint.constant";

import type {
  VoucherAllResponse,
  VoucherCreatePayload,
  VoucherListParams,
  VoucherListResponse,
  VoucherMutationResponse,
  VoucherRawResponse,
  VoucherUpdatePayload,
} from "@/modules/master-data/master-voucher/MasterVoucher.type";
import { normalizeVoucherResponse } from "@/modules/master-data/master-voucher/MasterVoucher.util";

export const masterVoucherService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getAllVouchers: builder.query<VoucherAllResponse, void>({
      query: () => ({ url: ENDPOINT.MASTER_VOUCHER.ALL, method: "GET" }),
      providesTags: ["Voucher"],
    }),
    getVouchers: builder.query<VoucherListResponse, VoucherListParams>({
      query: (params) => ({
        url: ENDPOINT.MASTER_VOUCHER.PAGED,
        method: "GET",
        params: { PageNumber: params.pageNumber, PageSize: params.pageSize, SearchTerm: params.searchTerm },
      }),
      providesTags: ["Voucher"],
    }),
    getVoucherById: builder.query<VoucherMutationResponse, string>({
      query: (id) => ({ url: `${ENDPOINT.MASTER_VOUCHER.DETAIL}/${id}`, method: "GET" }),
      transformResponse: (response: VoucherRawResponse): VoucherMutationResponse => normalizeVoucherResponse(response),
      providesTags: (_result, _error, id) => [{ type: "Voucher", id }],
    }),
    getVoucherByCode: builder.query<VoucherMutationResponse, string>({
      query: (code) => ({ url: `${ENDPOINT.MASTER_VOUCHER.BY_CODE}/${encodeURIComponent(code)}`, method: "GET" }),
      transformResponse: (response: VoucherRawResponse): VoucherMutationResponse => normalizeVoucherResponse(response),
    }),
    createVoucher: builder.mutation<VoucherMutationResponse, VoucherCreatePayload>({
      query: (body) => ({ url: ENDPOINT.MASTER_VOUCHER.CREATE, method: "POST", data: body }),
      transformResponse: (response: VoucherRawResponse): VoucherMutationResponse => normalizeVoucherResponse(response),
      invalidatesTags: ["Voucher"],
    }),
    updateVoucher: builder.mutation<VoucherMutationResponse, VoucherUpdatePayload>({
      query: ({ id, ...body }) => ({ url: `${ENDPOINT.MASTER_VOUCHER.DETAIL}/${id}`, method: "PUT", data: body }),
      transformResponse: (response: VoucherRawResponse): VoucherMutationResponse => normalizeVoucherResponse(response),
      invalidatesTags: ["Voucher"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllVouchersQuery,
  useGetVouchersQuery,
  useGetVoucherByIdQuery,
  useGetVoucherByCodeQuery,
  useCreateVoucherMutation,
  useUpdateVoucherMutation,
} = masterVoucherService;
