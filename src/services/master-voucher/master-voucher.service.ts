import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import type { ApiBaseData, ApiBaseItem } from "@/types/api.type";

import ENDPOINT from "@/constants/endpoint.constant";
import type { ApiVoucher, VoucherAllResponse, VoucherCreatePayload, VoucherCreateResponse, VoucherData, VoucherDetailResponse, VoucherListParams, VoucherListResponse, VoucherUpdatePayload } from "@/modules/master-data/master-voucher/MasterVoucher.type";

/**
 * Normalize raw voucher detail at service boundary.
 * @param {ApiBaseData} response - Raw response
 * @returns {VoucherDetailResponse} Normalized response
 */
export const normalizeVoucherDetailResponse = (response: ApiBaseData): VoucherDetailResponse => {
  const data: ApiBaseItem | undefined = Array.isArray(response.data)
    ? response.data[0]
    : response.data ?? undefined;
  let messages: string[] = [];

  if (Array.isArray(response.messages)) messages = response.messages;
  else if (response.messages) messages = [response.messages];
  const voucher: ApiVoucher | undefined = data?.id && data.name && data.code && data.discount_percent !== undefined && data.status !== undefined
    ? {
        id: data.id,
        name: data.name,
        code: data.code,
        discount_percent: data.discount_percent,
        status: data.status,
        ...(data.created_at ? { created_at: data.created_at } : {}),
        ...(data.updated_at ? { updated_at: data.updated_at } : {}),
      }
    : undefined;

  return { status: response.status, ...(voucher ? { data: voucher } : {}), messages };
};

/**
 * Map API voucher model to UI model.
 * @param {ApiVoucher} voucher - API voucher
 * @returns {VoucherData} UI voucher
 */
export const mapVoucher = (voucher: ApiVoucher): VoucherData => ({
  id: voucher.id,
  name: voucher.name,
  code: voucher.code,
  discountPercent: voucher.discount_percent,
  status: voucher.status === 1 ? "active" : "inactive",
  ...(voucher.created_at ? { createAt: voucher.created_at } : {}),
});

export const masterVoucherService = apiRtkClient.injectEndpoints({
  /**
   *
   * @param builder
   */
  endpoints: (builder) => ({
    getAllVouchers: builder.query<VoucherAllResponse, void>({
      query: () => ({ url: ENDPOINT.MASTER_VOUCHER.ALL, method: "GET" }),
      providesTags: ["Voucher"],
    }),
    getVouchers: builder.query<VoucherListResponse, VoucherListParams>({ /**
     *
     * @param params
     */
    query: (params) => ({ url: ENDPOINT.MASTER_VOUCHER.PAGED, method: "GET", params: { PageNumber: params.pageNumber, PageSize: params.pageSize, SearchTerm: params.searchTerm } }), providesTags: ["Voucher"] }),
    getVoucherById: builder.query<VoucherDetailResponse, string>({
      transformResponse: normalizeVoucherDetailResponse,
      query: (id) => ({ url: `${ENDPOINT.MASTER_VOUCHER.DETAIL}/${id}`, method: "GET" }),
    }),
    getVoucherByCode: builder.query<VoucherDetailResponse, string>({
      transformResponse: normalizeVoucherDetailResponse,
      query: (code) => ({ url: `${ENDPOINT.MASTER_VOUCHER.BY_CODE}/${encodeURIComponent(code)}`, method: "GET" }),
    }),
    createVoucher: builder.mutation<VoucherCreateResponse, VoucherCreatePayload>({ /**
     *
     * @param body
     */
    query: (body) => ({ url: ENDPOINT.MASTER_VOUCHER.CREATE, method: "POST", data: body }), invalidatesTags: ["Voucher"] }),
    updateVoucher: builder.mutation<VoucherCreateResponse, VoucherUpdatePayload>({
      /**
       *
       * @param body
       */
      query: (body) => ({
        url: `${ENDPOINT.MASTER_VOUCHER.CREATE}/${body.id}`,
        method: "PUT",
        data: { name: body.name, code: body.code, discount_percent: body.discount_percent, status: body.status },
      }),
      invalidatesTags: ["Voucher"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllVouchersQuery, useGetVouchersQuery, useGetVoucherByIdQuery, useGetVoucherByCodeQuery, useCreateVoucherMutation, useUpdateVoucherMutation } = masterVoucherService;
