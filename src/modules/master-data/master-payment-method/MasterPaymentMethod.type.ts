import type { ChangeEvent } from "react";
import { z } from "zod";

import { formatIndonesianDateTime } from "@/utils/date.helpers";

import type { ApiEnvelope, PaginatedResponse } from "@/types/api.type";

import { PAYMENT_METHOD_ACTIVE_STATUS, PAYMENT_METHOD_EMPTY_DESCRIPTION, PAYMENT_METHOD_EMPTY_VALUE } from "./MasterPaymentMethod.config";

/** Payment method status as shown in the UI. */
export type PaymentMethodStatus = "active" | "inactive";

/** API status code (`1` = active) mapped to the UI status. */
const PaymentMethodStatusSchema = z
  .number()
  .catch(0)
  .transform((status): PaymentMethodStatus => (status === PAYMENT_METHOD_ACTIVE_STATUS ? "active" : "inactive"));

/** API timestamp formatted for display, with a placeholder when absent. */
const PaymentMethodDateSchema = z
  .string()
  .nullish()
  .transform((value): string => (value ? formatIndonesianDateTime(value) : PAYMENT_METHOD_EMPTY_VALUE));

/** Raw payment method record as returned by `GET /api/payment-method/paged`. */
export const ApiPaymentMethodSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  description: z.string().nullish(),
  status: z.number(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
  created_by: z.string().nullish(),
});

/** Raw payment method record as returned by the API. */
export type ApiPaymentMethod = z.input<typeof ApiPaymentMethodSchema>;

/** Payment method row normalized for display; `source` keeps the raw record for the edit page. */
export const PaymentMethodListItemSchema = ApiPaymentMethodSchema.transform((paymentMethod) => ({
  id: paymentMethod.id,
  name: paymentMethod.name || PAYMENT_METHOD_EMPTY_VALUE,
  description: paymentMethod.description || PAYMENT_METHOD_EMPTY_DESCRIPTION,
  status: PaymentMethodStatusSchema.parse(paymentMethod.status),
  createdAt: PaymentMethodDateSchema.parse(paymentMethod.created_at),
  source: paymentMethod,
}));

/** Payment method row ready for the list view. */
export type PaymentMethodData = z.output<typeof PaymentMethodListItemSchema>;

/** Paged payment method list response. */
export type PaymentMethodListResponse = PaginatedResponse<ApiPaymentMethod>;

/** Create / update response for a single payment method. */
export type PaymentMethodMutationResponse = ApiEnvelope<ApiPaymentMethod | null>;

/** Create Payment Method request body. */
export type PaymentMethodCreatePayload = {
  name: string;
  description: string;
  status: number;
};

/** Update Payment Method request body. */
export type PaymentMethodUpdatePayload = PaymentMethodCreatePayload & {
  id: string;
};

/** Paged payment method list query params. */
export type PaymentMethodListParams = {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
};

/** Which part of the list view is rendered. */
export type PaymentMethodListStatus = "loading" | "error" | "missing" | "empty" | "ready";

/** List statuses that render a message instead of rows. */
export type PaymentMethodListMessageStatus = Exclude<PaymentMethodListStatus, "loading" | "ready">;

/** Normalized paged list data. */
export type PaymentMethodListView = {
  listStatus: PaymentMethodListStatus;
  paymentMethods: PaymentMethodData[];
  totalPages: number;
  totalCount: number;
};

/** Raw RTK Query state consumed by the list normalizer. */
export type PaymentMethodListQueryState = {
  data?: PaymentMethodListResponse;
  isLoading: boolean;
  isError: boolean;
};

/** Router state the list page receives after a create / update. */
export type PaymentMethodRouteState = {
  successMessage?: string;
} | null;

/** Router state the edit page receives from the list (no GET-by-id endpoint exists). */
export type PaymentMethodEditRouteState = {
  paymentMethod?: ApiPaymentMethod;
} | null;

/** Paging and search state of the payment method list. */
export type PaymentMethodListPaging = {
  queryParams: PaymentMethodListParams;
  currentPage: number;
  pageSize: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

/** Navigation handlers of the payment method list. */
export type PaymentMethodNavigation = {
  handleBack: () => void;
  handleCreate: () => void;
  handleEdit: (paymentMethod: PaymentMethodData) => void;
};

/** Payment method list state and handlers owned by the module hook. */
export type MasterPaymentMethodController = PaymentMethodListPaging & PaymentMethodNavigation;

/** Props of the payment method mobile card. */
export type PaymentMethodMobileCardProps = {
  paymentMethod: PaymentMethodData;
  canEdit: boolean;
  onEdit: (paymentMethod: PaymentMethodData) => void;
};

/** Props of the payment method list view. */
export type MasterPaymentMethodProps = PaymentMethodListView & {
  currentPage: number;
  pageSize: number;
  canCreate: boolean;
  canEdit: boolean;
  successMessage?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onCreate: () => void;
  onEdit: (paymentMethod: PaymentMethodData) => void;
};
