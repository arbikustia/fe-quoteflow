import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";

import ENDPOINT from "@/constant/endpoint.const";
import type { ApiVoucher, VoucherCreatePayload, VoucherCreateResponse, VoucherData, VoucherDetailResponse, VoucherListParams, VoucherListResponse, VoucherUpdatePayload } from "@/modules/master-voucher/MasterVoucher.type";

/**
 * Map API voucher model to UI model.
 * @param voucher
 */
export const mapVoucher = (voucher: ApiVoucher): VoucherData => ({
  id: voucher.id,
  name: voucher.name,
  code: voucher.code,
  discountPercent: voucher.discount_percent,
  status: voucher.status === 1 ? "active" : "inactive",
  createAt: voucher.created_at,
  createBy: null,
});

export const masterVoucherService = apiRtkClient.injectEndpoints({
  /**
   *
   * @param builder
   */
  endpoints: (builder) => ({
    getVouchers: builder.query<VoucherListResponse, VoucherListParams>({ /**
     *
     * @param params
     */
    query: (params) => ({ url: ENDPOINT.MASTER_VOUCHER.PAGED, method: "GET", params: { PageNumber: params.pageNumber, PageSize: params.pageSize, SearchTerm: params.searchTerm } }), providesTags: ["Voucher"] }),
    getVoucherById: builder.query<VoucherDetailResponse, string>({ /**
     *
     * @param id
     */
    query: (id) => ({ url: `${ENDPOINT.MASTER_VOUCHER.DETAIL}/${id}`, method: "GET" }) }),
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

export const { useGetVouchersQuery, useGetVoucherByIdQuery, useCreateVoucherMutation, useUpdateVoucherMutation } = masterVoucherService;
