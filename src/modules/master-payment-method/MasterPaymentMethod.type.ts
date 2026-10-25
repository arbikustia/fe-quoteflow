import type * as React from "react";
import type { FieldErrors, UseFormGetValues, UseFormRegister } from "react-hook-form";

export type PaymentMethodFormValues = {
  name: string;
  description: string;
  isActive: boolean;
};

export type PaymentMethodFormValidation = {
  errors: FieldErrors<PaymentMethodFormValues>;
  isSubmitted: boolean;
  register: UseFormRegister<PaymentMethodFormValues>;
};

export type PaymentMethodRouteState = {
  successMessage?: string;
};


import type { ApiEnvelope, ApiQueryParams, PaginatedResponse } from "@/types/api.type";

import type { PaginationResult } from "../../hooks/usePagination";

export type ApiPaymentMethod = {
  id: string;
  name: string | null;
  description: string | null;
  status: number;
  created_at: string | null;
  updated_at: string | null;
  created_by?: string | null;
};

export type PaymentMethodListResponse = PaginatedResponse<ApiPaymentMethod>;
export type PaymentMethodDetailResponse = ApiEnvelope<ApiPaymentMethod | ApiPaymentMethod[] | null>;
export type PaymentMethodCreateResponse = ApiEnvelope<ApiPaymentMethod | null>;
export type PaymentMethodListParams = ApiQueryParams;

export type PaymentMethodCreatePayload = {
  name: string;
  description: string;
  status: number;
};

export type PaymentMethodUpdatePayload = PaymentMethodCreatePayload & {
  id: string;
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
  isActive: boolean;
  getValues: UseFormGetValues<PaymentMethodFormValues>;
  validateForm: () => Promise<boolean>;
};

export type PaymentMethodSubmissionState = {
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
};

export type PaymentMethodFormFieldsState = PaymentMethodFormValidation & {
  name: string;
  description: string;
  isActive: boolean;
  getValues: UseFormGetValues<PaymentMethodFormValues>;
  validateForm: () => Promise<boolean>;
  handleNameChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleDescriptionChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
  onCreate: () => void;
  onEdit: (paymentMethod: PaymentMethodData) => void;
  onMore: () => void;
  isMoreOpen: boolean;
  onCloseMore: () => void;
  onDelete: () => void;
  onBack: () => void;
};

export type MasterPaymentMethodNavigation = {
  goBack: () => void;
  goCreate: () => void;
  goEdit: (p: PaymentMethodData) => void;
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
