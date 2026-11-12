import type {
  ApiVoucher,
  VoucherAllResponse,
  VoucherListResponse,
  VoucherMutationResponse,
} from "@/modules/master-data/master-voucher/MasterVoucher.type";

export const MOCK_API_VOUCHERS: ApiVoucher[] = [
  { id: "voucher-1", name: "Summer Promo", code: "SLABC123", discount_percent: 10, status: 1, created_at: "2026-10-30 22:00:54", updated_at: null },
  { id: "voucher-2", name: "Winter Promo", code: "WINTER25", discount_percent: 25, status: 0, created_at: null, updated_at: null },
];

export const MOCK_VOUCHER_LIST_RESPONSE: VoucherListResponse = {
  data: MOCK_API_VOUCHERS,
  page_number: 1,
  total_pages: 1,
  total_count: MOCK_API_VOUCHERS.length,
  has_previous: false,
  has_next: false,
};

export const MOCK_VOUCHER_DETAIL_RESPONSE: VoucherMutationResponse = {
  status: true,
  data: MOCK_API_VOUCHERS[0],
  messages: null,
};

export const MOCK_VOUCHER_ALL_RESPONSE: VoucherAllResponse = {
  status: true,
  data: MOCK_API_VOUCHERS,
  messages: null,
};
