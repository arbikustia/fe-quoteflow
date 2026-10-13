import type { TableColumn } from "../../components/Table";
import type { ApiEnvelope, PaginatedResponse } from "../../types/api.type";

export type ApiVoucher = {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly discount_percent: number;
  readonly status: number;
  readonly created_at: string | null;
  readonly updated_at: string | null;
};

export type VoucherListResponse = ApiEnvelope<PaginatedResponse<ApiVoucher> | null>;
export type VoucherCreateResponse = ApiEnvelope<ApiVoucher | null>;

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

export type VoucherData = {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly discountPercent: number;
  readonly status: "active" | "inactive";
  readonly createAt: string;
  readonly createBy: string;
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
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isEmpty: boolean;
  readonly isMissingData: boolean;
  readonly onCreate: () => void;
  readonly onEdit: (voucher: VoucherData) => void;
  readonly onRowClick: (voucher: VoucherData) => void;
  readonly onBack: () => void;
  readonly onMore?: () => void;
  readonly isMoreOpen?: boolean;
  readonly onCloseMore?: () => void;
  readonly onDelete?: () => void;
};

export type GetColumnsParams = {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly onEdit: (voucher: VoucherData) => void;
};
