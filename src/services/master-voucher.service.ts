import { apiRtkClient } from "@/libs/ApiRtkServices/apiRtkClient";
import type { ApiVoucher, VoucherCreatePayload, VoucherCreateResponse, VoucherData, VoucherListParams, VoucherListResponse } from "@/modules/master-voucher/MasterVoucher.type";

/** Map API voucher model to UI model. */
export const mapVoucher = (voucher: ApiVoucher): VoucherData => ({
  id: voucher.id,
  name: voucher.name,
  code: voucher.code,
  discountPercent: voucher.discount_percent,
  status: voucher.status === 1 ? "active" : "inactive",
  createAt: voucher.created_at ?? "",
  createBy: "",
});

export const masterVoucherService = apiRtkClient.injectEndpoints({
  endpoints: (builder) => ({
    getVouchers: builder.query<VoucherListResponse, VoucherListParams>({ query: (params) => ({ url: "/api/voucher/paged", method: "GET", params: { PageNumber: params.pageNumber, PageSize: params.pageSize, SearchTerm: params.searchTerm } }), providesTags: ["Voucher"] }),
    createVoucher: builder.mutation<VoucherCreateResponse, VoucherCreatePayload>({ query: (body) => ({ url: "/api/voucher", method: "POST", data: body }), invalidatesTags: ["Voucher"] }),
  }),
  overrideExisting: false,
});

export const { useGetVouchersQuery, useCreateVoucherMutation } = masterVoucherService;
