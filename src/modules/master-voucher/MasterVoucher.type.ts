import type * as React from "react";

import type { ApiEnvelope } from "../../types/api.type";

export type ApiVoucher = {
  id: string;
  name: string;
  code: string;
  discount_percent: number;
  status: number;
  created_at: string | null;
  updated_at: string | null;
};

export type VoucherListResponse = {
  data: ApiVoucher[];
  page_number: number;
  total_pages: number;
  page_size: number;
  total_count: number;
  has_previous: boolean;
  has_next: boolean;
  status: boolean;
  messages: string[] | string | null;
};
export type VoucherAllResponse = ApiEnvelope<ApiVoucher[]>;
export type VoucherCreateResponse = ApiEnvelope<ApiVoucher | null>;
export type VoucherDetailResponse = ApiEnvelope<ApiVoucher | ApiVoucher[] | null>;

export type VoucherFormValues = {
  name: string;
  code: string;
  codeMode: "generate" | "type";
  discountPercent: string;
  isActive: boolean;
};

export type VoucherRouteState = {
  voucher?: VoucherData;
  successMessage?: string;
};

export type VoucherSubmissionParams = {
  id: string | undefined;
  isEditMode: boolean;
  isActive: boolean;
  getValues: () => VoucherFormValues;
  validateForm: () => Promise<boolean>;
};

export type VoucherFormValidation = {
  errors: import("react-hook-form").FieldErrors<VoucherFormValues>;
  isSubmitted: boolean;
};

export type VoucherSubmissionState = {
  isSubmitting: boolean;
  errorMessage: string | null;
  handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
};

export type VoucherFormFieldsState = VoucherFormValues & VoucherFormValidation & {
  getValues: () => VoucherFormValues;
  validateForm: () => Promise<boolean>;
  handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCodeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCodeModeChange: (value: string) => void;
  handleDiscountChange: (value: number | null) => void;
  handleStatusChange: () => void;
};

export type VoucherListParams = {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
};

export type VoucherCreatePayload = {
  name: string;
  code: string;
  discount_percent: number;
  status: number;
};

export type VoucherUpdatePayload = VoucherCreatePayload & {
  id: string;
};

export type MasterVoucherCreateFormState = {
  name: string;
  code: string;
  codeMode: "generate" | "type";
  discountPercent: string;
  isActive: boolean;
  isEditMode: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCodeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCodeModeChange: (value: string) => void;
  handleDiscountChange: (value: number | null) => void;
  handleStatusChange: () => void;
  handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
  goBack: () => void;
};

export type VoucherData = {
  id: string;
  name: string;
  code: string;
  discountPercent: number;
  status: "active" | "inactive";
  createAt: string | null;
  createBy: string | null;
};

export type VoucherListApiState = {
  isLoading: boolean;
  errorMessage: string | null;
  isMissingData: boolean;
  paginatedData: VoucherData[];
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type MasterVoucherNavigation = {
  goBack: () => void;
  goCreate: () => void;
  goEdit: (voucher: VoucherData) => void;
};

export type MasterVoucherPagination = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: VoucherData[];
  totalCount: number;
  isLoading: boolean;
  errorMessage: string | null;
  isEmpty: boolean;
  isMissingData: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  setSearchTerm: (searchTerm: string) => void;
};

export type MasterVoucherContainerState = MasterVoucherNavigation & {
  pagination: MasterVoucherPagination;
  isMoreOpen: boolean;
  toggleMore: () => void;
  goDelete: () => void;
  handleCloseMore: () => void;
};

export type MasterVoucherProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: VoucherData[];
  totalCount: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  setSearchTerm: (searchTerm: string) => void;
  isLoading: boolean;
  errorMessage: string | null;
  isEmpty: boolean;
  isMissingData: boolean;
  onCreate: () => void;
  onEdit: (voucher: VoucherData) => void;
  onBack: () => void;
  onDownload?: (voucher: VoucherData) => void;
  onMore?: () => void;
  isMoreOpen?: boolean;
  onCloseMore?: () => void;
  onDelete?: () => void;
};
