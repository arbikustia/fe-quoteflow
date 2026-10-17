import type * as React from "react";

import type { TableColumn } from "../../components/Table";
import type { ApiEnvelope } from "../../types/api.type";

export type ApiVoucher = {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly discount_percent: number;
  readonly status: number;
  readonly created_at: string | null;
  readonly updated_at: string | null;
};

export type VoucherListResponse = {
  readonly data: ApiVoucher[];
  readonly page_number: number;
  readonly total_pages: number;
  readonly page_size: number;
  readonly total_count: number;
  readonly has_previous: boolean;
  readonly has_next: boolean;
  readonly status: boolean;
  readonly messages: string[] | string | null;
};
export type VoucherCreateResponse = ApiEnvelope<ApiVoucher | null>;
export type VoucherDetailResponse = ApiEnvelope<ApiVoucher | ApiVoucher[] | null>;

export type VoucherSubmissionParams = {
  readonly id: string | undefined;
  readonly isEditMode: boolean;
  readonly name: string;
  readonly code: string;
  readonly codeMode: "generate" | "type";
  readonly discountPercent: string;
  readonly isActive: boolean;
};

export type VoucherSubmissionState = {
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
};

export type VoucherFormFieldsState = {
  readonly name: string;
  readonly code: string;
  readonly codeMode: "generate" | "type";
  readonly discountPercent: string;
  readonly isActive: boolean;
  readonly handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleCodeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleCodeModeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  readonly handleDiscountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleStatusChange: () => void;
};

export type VoucherListParams = {
  readonly pageNumber: number;
  readonly pageSize: number;
  readonly searchTerm: string;
};

export type VoucherCreatePayload = {
  readonly name: string;
  readonly code: string;
  readonly discount_percent: number;
  readonly status: number;
};

export type VoucherUpdatePayload = VoucherCreatePayload & {
  readonly id: string;
};

export type MasterVoucherCreateFormState = {
  readonly name: string;
  readonly code: string;
  readonly codeMode: "generate" | "type";
  readonly discountPercent: string;
  readonly isActive: boolean;
  readonly isEditMode: boolean;
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleCodeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleCodeModeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  readonly handleDiscountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleStatusChange: () => void;
  readonly handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
  readonly goBack: () => void;
};

export type VoucherData = {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly discountPercent: number;
  readonly status: "active" | "inactive";
  readonly createAt: string | null;
  readonly createBy: string | null;
};

export type VoucherListApiState = {
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isMissingData: boolean;
  readonly paginatedData: VoucherData[];
  readonly totalPages: number;
  readonly totalCount: number;
  readonly hasNext: boolean;
  readonly hasPrevious: boolean;
};

export type MasterVoucherNavigation = {
  readonly goBack: () => void;
  readonly goCreate: () => void;
  readonly goEdit: (voucher: VoucherData) => void;
  readonly goDetail: (voucher: VoucherData) => void;
};

export type MasterVoucherPagination = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: VoucherData[];
  readonly totalCount: number;
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isEmpty: boolean;
  readonly isMissingData: boolean;
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
  readonly setSearchTerm: (searchTerm: string) => void;
};

export type MasterVoucherContainerState = MasterVoucherNavigation & {
  readonly pagination: MasterVoucherPagination;
  readonly isMoreOpen: boolean;
  readonly toggleMore: () => void;
  readonly goDelete: () => void;
  readonly handleCloseMore: () => void;
};

export type MasterVoucherProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: readonly VoucherData[];
  readonly totalCount: number;
  readonly columns: readonly TableColumn<VoucherData>[];
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
  readonly setSearchTerm: (searchTerm: string) => void;
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isEmpty: boolean;
  readonly isMissingData: boolean;
  readonly onCreate: () => void;
  readonly onEdit: (voucher: VoucherData) => void;
  readonly onRowClick: (voucher: VoucherData) => void;
  readonly onBack: () => void;
  readonly onDownload?: (voucher: VoucherData) => void;
  readonly onMore?: () => void;
  readonly isMoreOpen?: boolean;
  readonly onCloseMore?: () => void;
  readonly onDelete?: () => void;
};

export type GetColumnsParams = {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly onEdit: (voucher: VoucherData) => void;
  readonly onDownload?: (voucher: VoucherData) => void;
};
