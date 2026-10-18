import type * as React from "react";

import type { ApiEnvelope, ApiQueryParams, PaginatedResponse } from "@/types/api.type";

import type { TableColumn } from "../../components/Table";
import type { PaginationResult } from "../../hooks/usePagination";

export type ApiPaymentType = {
  readonly id: string;
  readonly name: string | null;
  readonly status: number;
  readonly created_at: string | null;
  readonly updated_at: string | null;
  readonly created_by?: string | null;
};

export type PaymentTypeListResponse = PaginatedResponse<ApiPaymentType>;
export type PaymentTypeDetailResponse = ApiEnvelope<ApiPaymentType | ApiPaymentType[] | null>;
export type PaymentTypeCreateResponse = ApiEnvelope<ApiPaymentType | null>;
export type PaymentTypeListParams = ApiQueryParams;

export type PaymentTypeCreatePayload = {
  readonly name: string;
  readonly status: number;
};

export type PaymentTypeUpdatePayload = PaymentTypeCreatePayload & {
  readonly id: string;
};

export type PaymentTypeData = {
  id: string;
  name: string | null;
  status: "active" | "inactive";
  createAt: string | null;
  createBy: string | null;
};

export type PaymentTypeSubmissionParams = {
  id: string | undefined;
  isEditMode: boolean;
  name: string;
  isActive: boolean;
};

export type PaymentTypeSubmissionState = {
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
};

export type PaymentTypeFormFieldsState = {
  name: string;
  isActive: boolean;
  handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: () => void;
};

export type PaymentTypeListApiState = {
  isLoading: boolean;
  errorMessage: string | null;
  isMissingData: boolean;
  paginatedData: PaymentTypeData[];
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type MasterPaymentTypeNavigation = {
  goBack: () => void;
  goCreate: () => void;
  goEdit: (paymentType: PaymentTypeData) => void;
  goDetail: (paymentType: PaymentTypeData) => void;
};

export type MasterPaymentTypePagination = PaginationResult<PaymentTypeData> & {
  isLoading: boolean;
  errorMessage: string | null;
  isMissingData: boolean;
  isEmpty: boolean;
  setSearchTerm: (searchTerm: string) => void;
};

export type MasterPaymentTypeContainerState = MasterPaymentTypeNavigation & {
  pagination: MasterPaymentTypePagination;
  isMoreOpen: boolean;
  toggleMore: () => void;
  goDelete: () => void;
  handleCloseMore: () => void;
};

export type MasterPaymentTypeProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: PaymentTypeData[];
  totalCount: number;
  isLoading: boolean;
  errorMessage: string | null;
  isMissingData: boolean;
  isEmpty: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  setSearchTerm: (searchTerm: string) => void;
  columns: TableColumn<PaymentTypeData>[];
  onCreate: () => void;
  onEdit: (paymentType: PaymentTypeData) => void;
  onRowClick: (paymentType: PaymentTypeData) => void;
  onMore: () => void;
  isMoreOpen: boolean;
  onCloseMore: () => void;
  onDelete: () => void;
  onBack: () => void;
};

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (paymentType: PaymentTypeData) => void;
};
