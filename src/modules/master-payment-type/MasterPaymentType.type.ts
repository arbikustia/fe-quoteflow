import type { TableColumn } from "../../components/Table";
import type { ApiEnvelope, PaginatedResponse } from "../../types/api.type";

export type ApiPaymentType = {
  readonly id: string;
  readonly name: string;
  readonly status: number;
  readonly created_at: string | null;
  readonly created_by: string | null;
  readonly updated_at: string | null;
};

export type PaymentTypeListResponse = ApiEnvelope<PaginatedResponse<ApiPaymentType> | null>;
export type PaymentTypeCreateResponse = ApiEnvelope<ApiPaymentType | null>;

export type PaymentTypeListParams = {
  readonly pageNumber: number;
  readonly pageSize: number;
  readonly searchTerm: string;
};

export type PaymentTypeData = {
  readonly id: string;
  readonly name: string;
  readonly status: "active" | "inactive";
  readonly createAt: string;
  readonly createBy: string;
};

export type PaymentTypeCreatePayload = {
  readonly name: string;
};

export type MasterPaymentTypeCreateFormState = {
  readonly name: string;
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly successMessage: string | null;
  readonly handleNameChange: (name: string) => void;
  readonly handleSubmit: () => Promise<void>;
};


export type PaymentTypeListApiState = {
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isEnvelopeError: boolean;
  readonly isMissingData: boolean;
  readonly paginatedData: PaymentTypeData[];
  readonly totalPages: number;
  readonly totalCount: number;
};

export type MasterPaymentTypeNavigation = {
  readonly goBack: () => void;
  readonly goCreate: () => void;
  readonly goEdit: (paymentType: PaymentTypeData) => void;
  readonly goDetail: (paymentType: PaymentTypeData) => void;
};

export type MasterPaymentTypePagination = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: PaymentTypeData[];
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

export type MasterPaymentTypeContainerState = {
  readonly pagination: MasterPaymentTypePagination;
  readonly isMoreOpen: boolean;
  readonly toggleMore: () => void;
  readonly handleCloseMore: () => void;
  readonly goDelete: () => void;
};

export type MasterPaymentTypeProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: PaymentTypeData[];
  readonly totalCount: number;
  readonly columns: TableColumn<PaymentTypeData>[];
  readonly isMoreOpen: boolean;
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isEmpty: boolean;
  readonly isMissingData: boolean;
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
  readonly setSearchTerm: (searchTerm: string) => void;
  readonly onCreate: () => void;
  readonly onEdit: (paymentType: PaymentTypeData) => void;
  readonly onRowClick: (paymentType: PaymentTypeData) => void;
  readonly onBack: () => void;
  readonly onMore: () => void;
  readonly onCloseMore: () => void;
  readonly onDelete: () => void;
};

export type GetColumnsParams = {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly onEdit: (paymentType: PaymentTypeData) => void;
};
