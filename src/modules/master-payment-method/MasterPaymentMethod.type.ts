import type { TableColumn } from "../../components/Table";
import type { ApiEnvelope, PaginatedResponse } from "../../types/api.type";

export type ApiPaymentMethod = {
  readonly id: string;
  readonly name: string;
  readonly description: string | null;
  readonly status: number;
  readonly created_at: string | null;
  readonly created_by: string | null;
};

export type PaymentMethodListResponse = ApiEnvelope<PaginatedResponse<ApiPaymentMethod> | null>;
export type PaymentMethodCreateResponse = ApiEnvelope<ApiPaymentMethod | null>;

export type PaymentMethodListParams = {
  readonly pageNumber: number;
  readonly pageSize: number;
  readonly searchTerm: string;
};

export type PaymentMethodData = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly status: "active" | "inactive";
  readonly createAt: string;
  readonly createBy: string;
};

export type PaymentMethodListApiState = {
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isEnvelopeError: boolean;
  readonly isMissingData: boolean;
  readonly paginatedData: PaymentMethodData[];
  readonly totalPages: number;
  readonly totalCount: number;
};

export type PaymentMethodCreatePayload = {
  readonly name: string;
  readonly description: string;
};

export type MasterPaymentMethodNavigation = {
  readonly goBack: () => void;
  readonly goCreate: () => void;
  readonly goEdit: (paymentMethod: PaymentMethodData) => void;
  readonly goDetail: (paymentMethod: PaymentMethodData) => void;
};

export type MasterPaymentMethodPagination = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: PaymentMethodData[];
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

export type MasterPaymentMethodContainerState = {
  readonly pagination: MasterPaymentMethodPagination;
  readonly isMoreOpen: boolean;
  readonly toggleMore: () => void;
  readonly handleCloseMore: () => void;
  readonly goDelete: () => void;
};

export type MasterPaymentMethodProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: PaymentMethodData[];
  readonly totalCount: number;
  readonly columns: TableColumn<PaymentMethodData>[];
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
  readonly onEdit: (paymentMethod: PaymentMethodData) => void;
  readonly onRowClick: (paymentMethod: PaymentMethodData) => void;
  readonly onBack: () => void;
  readonly onMore: () => void;
  readonly onCloseMore: () => void;
  readonly onDelete: () => void;
};

export type GetColumnsParams = {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly onEdit: (paymentMethod: PaymentMethodData) => void;
};

export type InputFieldProps = {
  readonly label: string;
  readonly placeholder: string;
  readonly value: string;
  readonly required?: boolean;
  readonly icon: React.ReactNode;
  readonly type?: string;
  readonly multiline?: boolean;
  readonly onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export type MasterPaymentMethodCreateFormState = {
  readonly name: string;
  readonly description: string;
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly successMessage: string | null;
  readonly handleNameChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readonly handleDescriptionChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readonly handleSubmit: (event: React.SyntheticEvent) => void;
  readonly goBack: () => void;
};
