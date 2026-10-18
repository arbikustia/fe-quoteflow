import type * as React from "react";

import type { ApiEnvelope, ApiQueryParams, PaginatedResponse } from "@/types/api.type";

import type { TableColumn } from "../../components/Table";
import type { PaginationResult } from "../../hooks/usePagination";

export type ApiPaymentMethod = {
  readonly id: string;
  readonly name: string | null;
  readonly description: string | null;
  readonly status: number;
  readonly created_at: string | null;
  readonly updated_at: string | null;
  readonly created_by?: string | null;
};

export type PaymentMethodListResponse = PaginatedResponse<ApiPaymentMethod>;
export type PaymentMethodDetailResponse = ApiEnvelope<ApiPaymentMethod | ApiPaymentMethod[] | null>;
export type PaymentMethodCreateResponse = ApiEnvelope<ApiPaymentMethod | null>;
export type PaymentMethodListParams = ApiQueryParams;

export type PaymentMethodCreatePayload = {
  readonly name: string;
  readonly description: string;
  readonly status: number;
};

export type PaymentMethodUpdatePayload = PaymentMethodCreatePayload & {
  readonly id: string;
};

export type PaymentMethodData = {
  id: string;
  name: string | null;
  description: string | null;
  status: "active" | "inactive";
  createAt: string | null;
  createBy: string | null;
};

export type PaymentMethodSubmissionParams = {
  id: string | undefined;
  isEditMode: boolean;
  name: string;
  description: string;
  isActive: boolean;
};

export type PaymentMethodSubmissionState = {
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
};

export type PaymentMethodFormFieldsState = {
  name: string;
  description: string;
  isActive: boolean;
  handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleStatusChange: () => void;
};

export type PaymentMethodListApiState = {
  isLoading: boolean;
  errorMessage: string | null;
  isMissingData: boolean;
  paginatedData: PaymentMethodData[];
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type MasterPaymentMethodProps = {
  currentPage: number;
  isLoading: boolean;
  errorMessage: string | null;
  isMissingData: boolean;
  totalPages: number;
  pageSize: number;
  paginatedData: PaymentMethodData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
  isEmpty: boolean;
  setSearchTerm: (searchTerm: string) => void;
  columns: TableColumn<PaymentMethodData>[];
  onCreate: () => void;
  onEdit: (paymentMethod: PaymentMethodData) => void;
  onRowClick: (paymentMethod: PaymentMethodData) => void;
  onMore: () => void;
  isMoreOpen: boolean;
  onCloseMore: () => void;
  onDelete: () => void;
  onBack: () => void;
};

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (paymentMethod: PaymentMethodData) => void;
};

export type MasterPaymentMethodNavigation = {
  goBack: () => void;
  goCreate: () => void;
  goEdit: (p: PaymentMethodData) => void;
  goDetail: (p: PaymentMethodData) => void;
};

export type MasterPaymentMethodPagination = PaginationResult<PaymentMethodData> & {
  isLoading: boolean;
  errorMessage: string | null;
  isMissingData: boolean;
  isEmpty: boolean;
  setSearchTerm: (searchTerm: string) => void;
};

export type MasterPaymentMethodContainerState = MasterPaymentMethodNavigation & {
  pagination: MasterPaymentMethodPagination;
  isMoreOpen: boolean;
  toggleMore: () => void;
  goDelete: () => void;
  handleCloseMore: () => void;
};
