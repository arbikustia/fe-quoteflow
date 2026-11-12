import type { ChangeEvent } from "react";
import { z } from "zod";

import { formatIndonesianDateTime } from "@/utils/date.helpers";

import type { ApiEnvelope, PaginatedResponse } from "@/types/api.type";

import { ORDER_TYPE_ACTIVE_STATUS, ORDER_TYPE_EMPTY_DATE_VALUE } from "./MasterOrderType.config";

/** Order type status as shown in the UI. */
export type OrderTypeStatus = "active" | "inactive";

/** Yes / no flag as shown in the UI. */
export type OrderTypeFlag = "yes" | "no";

/** API status code (`1` = active) mapped to the UI status. */
const OrderTypeStatusSchema = z
  .number()
  .catch(0)
  .transform((status): OrderTypeStatus => (status === ORDER_TYPE_ACTIVE_STATUS ? "active" : "inactive"));

/** API boolean mapped to the UI flag; a missing value reads as "no". */
const OrderTypeFlagSchema = z
  .boolean()
  .catch(false)
  .transform((value): OrderTypeFlag => (value ? "yes" : "no"));

/** API timestamp formatted for display, with a placeholder when absent. */
const OrderTypeDateSchema = z
  .string()
  .nullish()
  .transform((value): string => (value ? formatIndonesianDateTime(value) : ORDER_TYPE_EMPTY_DATE_VALUE));

/** Order type row from `GET /api/order-type/paged`, normalized for display. */
export const OrderTypeListItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    is_handover: OrderTypeFlagSchema,
    status: OrderTypeStatusSchema,
    created_at: OrderTypeDateSchema,
  })
  .transform((orderType) => ({
    id: orderType.id,
    name: orderType.name,
    isHandover: orderType.is_handover,
    status: orderType.status,
    createdAt: orderType.created_at,
  }));

/** Raw order type record as returned by the API. */
export type ApiOrderType = z.input<typeof OrderTypeListItemSchema> & {
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
};

/** Order type row ready for the list view. */
export type OrderTypeData = z.output<typeof OrderTypeListItemSchema>;

/** Paged order type list response. */
export type OrderTypeListResponse = PaginatedResponse<ApiOrderType>;

/** Create / update / detail response for a single order type. */
export type OrderTypeMutationResponse = ApiEnvelope<ApiOrderType | null>;

/** Create order type request body. */
export type OrderTypeCreatePayload = {
  name: string;
  is_handover: boolean;
  status: number;
};

/** Update order type request body. */
export type OrderTypeUpdatePayload = OrderTypeCreatePayload & {
  id: string;
};

/** Paged order type list query params. */
export type OrderTypeListParams = {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
};

/** Which part of the list view is rendered. */
export type OrderTypeListStatus = "loading" | "error" | "missing" | "empty" | "ready";

/** List statuses that render a message instead of rows. */
export type OrderTypeListMessageStatus = Exclude<OrderTypeListStatus, "loading" | "ready">;

/** Normalized paged list data. */
export type OrderTypeListView = {
  listStatus: OrderTypeListStatus;
  orderTypes: OrderTypeData[];
  totalPages: number;
  totalCount: number;
};

/** Raw RTK Query state consumed by the list normalizer. */
export type OrderTypeListQueryState = {
  data?: OrderTypeListResponse;
  isLoading: boolean;
  isError: boolean;
};

/** Router state the list page receives after a create / update. */
export type OrderTypeRouteState = {
  successMessage?: string;
} | null;

/** Paging and search state of the order type list. */
export type OrderTypeListPaging = {
  queryParams: OrderTypeListParams;
  currentPage: number;
  pageSize: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

/** Navigation handlers of the order type list. */
export type OrderTypeNavigation = {
  handleBack: () => void;
  handleCreate: () => void;
  handleEdit: (orderType: OrderTypeData) => void;
};

/** Order type list state and handlers owned by the module hook. */
export type MasterOrderTypeController = OrderTypeListPaging & OrderTypeNavigation;

/** Props of the order type mobile card. */
export type OrderTypeMobileCardProps = {
  orderType: OrderTypeData;
  canEdit: boolean;
  onEdit: (orderType: OrderTypeData) => void;
};

/** Props of the order type list view. */
export type MasterOrderTypeProps = OrderTypeListView & {
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
  onEdit: (orderType: OrderTypeData) => void;
};
