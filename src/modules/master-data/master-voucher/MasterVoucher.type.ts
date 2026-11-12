import type { ChangeEvent } from "react";
import { z } from "zod";

import { formatIndonesianDateTime } from "@/utils/date.helpers";

import type { ApiEnvelope, PaginatedResponse } from "@/types/api.type";

import { VOUCHER_ACTIVE_STATUS, VOUCHER_EMPTY_VALUE } from "./MasterVoucher.config";

/** Voucher status as shown in the UI. */
export type VoucherStatus = "active" | "inactive";

/** API status code (`1` = active) mapped to the UI status. */
const VoucherStatusSchema = z
  .number()
  .catch(0)
  .transform((status): VoucherStatus => (status === VOUCHER_ACTIVE_STATUS ? "active" : "inactive"));

/** API timestamp formatted for display, with a placeholder when absent. */
const VoucherDateSchema = z
  .string()
  .nullish()
  .transform((value): string => (value ? formatIndonesianDateTime(value) : VOUCHER_EMPTY_VALUE));

/** Raw voucher record as returned by the voucher endpoints. */
export const ApiVoucherSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  discount_percent: z.number(),
  status: z.number(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

/** Raw voucher record as returned by the API. */
export type ApiVoucher = z.input<typeof ApiVoucherSchema>;

/** Voucher row normalized for display. */
export const VoucherListItemSchema = ApiVoucherSchema.transform((voucher) => ({
  id: voucher.id,
  name: voucher.name || VOUCHER_EMPTY_VALUE,
  code: voucher.code || VOUCHER_EMPTY_VALUE,
  discountPercent: voucher.discount_percent,
  status: VoucherStatusSchema.parse(voucher.status),
  createdAt: VoucherDateSchema.parse(voucher.created_at),
}));

/** Voucher row ready for the list view. */
export type VoucherData = z.output<typeof VoucherListItemSchema>;

/** Paged voucher list response. */
export type VoucherListResponse = PaginatedResponse<ApiVoucher>;

/** Select-all voucher response. */
export type VoucherAllResponse = ApiEnvelope<ApiVoucher[]>;

/** Detail / create / update response as sent by the backend: one voucher or a list of one. */
export type VoucherRawResponse = ApiEnvelope<ApiVoucher | ApiVoucher[] | null>;

/** Detail / create / update response normalized at the service boundary. */
export type VoucherMutationResponse = ApiEnvelope<ApiVoucher | null>;

/** Create Voucher request body. */
export type VoucherCreatePayload = {
  name: string;
  code: string;
  discount_percent: number;
  status: number;
};

/** Update Voucher request body. */
export type VoucherUpdatePayload = VoucherCreatePayload & {
  id: string;
};

/** Paged voucher list query params. */
export type VoucherListParams = {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
};

/** Which part of the list view is rendered. */
export type VoucherListStatus = "loading" | "error" | "missing" | "empty" | "ready";

/** List statuses that render a message instead of rows. */
export type VoucherListMessageStatus = Exclude<VoucherListStatus, "loading" | "ready">;

/** Normalized paged list data. */
export type VoucherListView = {
  listStatus: VoucherListStatus;
  vouchers: VoucherData[];
  totalPages: number;
  totalCount: number;
};

/** Raw RTK Query state consumed by the list normalizer. */
export type VoucherListQueryState = {
  data?: VoucherListResponse;
  isLoading: boolean;
  isError: boolean;
};

/** Router state the list page receives after a create / update. */
export type VoucherRouteState = {
  successMessage?: string;
} | null;

/** Paging and search state of the voucher list. */
export type VoucherListPaging = {
  queryParams: VoucherListParams;
  currentPage: number;
  pageSize: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

/** Navigation handlers of the voucher list. */
export type VoucherNavigation = {
  handleBack: () => void;
  handleCreate: () => void;
  handleEdit: (voucher: VoucherData) => void;
};

/** Voucher list state and handlers owned by the module hook. */
export type MasterVoucherController = VoucherListPaging & VoucherNavigation & {
  handleDownload: (voucher: VoucherData) => void;
};

/** Edit permission and row callbacks of the voucher table action cell. */
export type VoucherRowActions = {
  canEdit: boolean;
  onEdit: (voucher: VoucherData) => void;
  onDownload: (voucher: VoucherData) => void;
};

/** Props of the voucher mobile card. */
export type VoucherMobileCardProps = {
  voucher: VoucherData;
  canEdit: boolean;
  onEdit: (voucher: VoucherData) => void;
};

/** Props of the voucher list view. */
export type MasterVoucherProps = VoucherListView & {
  currentPage: number;
  pageSize: number;
  canCreate: boolean;
  canEdit: boolean;
  successMessage?: string;
  onDownload: (voucher: VoucherData) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onCreate: () => void;
  onEdit: (voucher: VoucherData) => void;
};
