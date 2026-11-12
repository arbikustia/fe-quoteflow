import type { ChangeEvent } from "react";
import { z } from "zod";

import type { ApiEnvelope, ApiMessages, PaginatedResponse } from "@/types/api.type";

import { CUSTOMER_ACTIVE_STATUS, CUSTOMER_EMPTY_DISPLAY_VALUE } from "./MasterCustomer.config";

/** Customer status as shown in the UI. */
export type CustomerStatus = "active" | "inactive";

/** Optional text column rendered with a placeholder when the API sends nothing. */
const CustomerDisplayTextSchema = z
  .string()
  .nullish()
  .transform((value): string => value?.trim() || CUSTOMER_EMPTY_DISPLAY_VALUE);

/** API status code (`1` = active) mapped to the UI status. */
const CustomerStatusSchema = z
  .number()
  .catch(0)
  .transform((status): CustomerStatus => (status === CUSTOMER_ACTIVE_STATUS ? "active" : "inactive"));

/** Customer row from `GET /api/customer/paged`, normalized for display. */
export const CustomerListItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    email: CustomerDisplayTextSchema,
    address: CustomerDisplayTextSchema,
    phone_number: CustomerDisplayTextSchema,
    status: CustomerStatusSchema,
  })
  .transform((customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    address: customer.address,
    phoneNumber: customer.phone_number,
    status: customer.status,
  }));

/** Raw customer record as returned by the API. */
export type ApiCustomer = z.input<typeof CustomerListItemSchema>;

/** Customer row ready for the list view. */
export type CustomerData = z.output<typeof CustomerListItemSchema>;

/** Paged customer list response. */
export type CustomerListResponse = PaginatedResponse<ApiCustomer>;

/** Customer option from `GET /api/customer/get-all-customer` (consumed by the order form). */
export type CustomerOption = {
  id: string;
  name: string;
  email?: string;
  address: string;
  phone_number: string;
};

/** Customer lookup response. */
export type CustomerAllResponse = ApiEnvelope<CustomerOption[]>;

/** Create / update / detail response for a single customer. */
export type CustomerMutationResponse = {
  status: boolean;
  data?: ApiCustomer | null;
  messages?: ApiMessages;
};

/** Create customer request body. */
export type CustomerCreatePayload = {
  name: string;
  email: string;
  address: string;
  phone_number: string;
  status: number;
};

/** Update customer request body. */
export type CustomerUpdatePayload = CustomerCreatePayload & {
  id: string;
};

/** Paged customer list query params. */
export type CustomerListParams = {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
};

/** Which part of the list view is rendered. */
export type CustomerListStatus = "loading" | "error" | "missing" | "empty" | "ready";

/** List statuses that render a message instead of rows. */
export type CustomerListMessageStatus = Exclude<CustomerListStatus, "loading" | "ready">;

/** Normalized paged list data. */
export type CustomerListView = {
  listStatus: CustomerListStatus;
  customers: CustomerData[];
  totalPages: number;
  totalCount: number;
};

/** Raw RTK Query state consumed by the list normalizer. */
export type CustomerListQueryState = {
  data?: CustomerListResponse;
  isLoading: boolean;
  isError: boolean;
};

/** Router state the list page receives after a create / update. */
export type CustomerRouteState = {
  successMessage?: string;
} | null;

/** Paging and search state of the customer list. */
export type CustomerListPaging = {
  queryParams: CustomerListParams;
  currentPage: number;
  pageSize: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  handleSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

/** Navigation handlers of the customer list. */
export type CustomerNavigation = {
  handleBack: () => void;
  handleCreate: () => void;
  handleEdit: (customer: CustomerData) => void;
};

/** Customer list state and handlers owned by the module hook. */
export type MasterCustomerController = CustomerListPaging & CustomerNavigation;

/** Props of the customer mobile card. */
export type CustomerMobileCardProps = {
  customer: CustomerData;
  onEdit: (customer: CustomerData) => void;
};

/** Props of the customer list view. */
export type MasterCustomerProps = CustomerListView & {
  currentPage: number;
  pageSize: number;
  successMessage?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onCreate: () => void;
  onEdit: (customer: CustomerData) => void;
};
