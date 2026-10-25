import type * as React from "react";
import type { FieldErrors, UseFormGetValues, UseFormRegister } from "react-hook-form";

export type PaymentTypeFormValues = {
  name: string;
  isActive: boolean;
};

export type PaymentTypeRouteState = {
  successMessage?: string;
};

export type PaymentTypeFormValidation = {
  errors: FieldErrors<PaymentTypeFormValues>;
  isSubmitted: boolean;
  register: UseFormRegister<PaymentTypeFormValues>;
};


import type { ApiEnvelope, ApiQueryParams, PaginatedResponse } from "@/types/api.type";

import type { PaginationResult } from "../../hooks/usePagination";

export type ApiPaymentType = {
  id: string;
  name: string | null;
  status: number;
  created_at: string | null;
  updated_at: string | null;
  created_by?: string | null;
};

export type PaymentTypeListResponse = PaginatedResponse<ApiPaymentType>;
export type PaymentTypeDetailResponse = ApiEnvelope<ApiPaymentType | ApiPaymentType[] | null>;
export type PaymentTypeCreateResponse = ApiEnvelope<ApiPaymentType | null>;
export type PaymentTypeListParams = ApiQueryParams;

export type PaymentTypeCreatePayload = {
  name: string;
  status: number;
};

export type PaymentTypeUpdatePayload = PaymentTypeCreatePayload & {
  id: string;
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
  isActive: boolean;
  getValues: UseFormGetValues<PaymentTypeFormValues>;
  validateForm: () => Promise<boolean>;
};

export type PaymentTypeSubmissionState = {
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
};

export type PaymentTypeFormFieldsState = PaymentTypeFormValidation & {
  name: string;
  isActive: boolean;
  getValues: UseFormGetValues<PaymentTypeFormValues>;
  validateForm: () => Promise<boolean>;
  handleNameChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
  onCreate: () => void;
  onEdit: (paymentType: PaymentTypeData) => void;
  onBack: () => void;
};

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (paymentType: PaymentTypeData) => void;
};
