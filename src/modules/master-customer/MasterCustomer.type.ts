import type { TableColumn } from "../../components/Table";
import type { ApiEnvelope, PaginatedResponse } from "../../types/api.type";

export type ApiCustomer = {
  readonly id: string;
  readonly name: string;
  readonly address: string | null;
  readonly phone_number: string | null;
  readonly status: number;
  readonly created_at: string | null;
  readonly created_by: string | null;
};

export type CustomerListResponse = PaginatedResponse<ApiCustomer>;
export type CustomerCreateResponse = ApiEnvelope<ApiCustomer | null>;
export type CustomerUpdatePayload = {
  readonly id: string;
  readonly name: string;
  readonly address: string;
  readonly phone_number: string;
  readonly status: number;
};
export type CustomerDetailResponse = ApiEnvelope<ApiCustomer | null>;

export type CustomerListParams = {
  readonly pageNumber: number;
  readonly pageSize: number;
  readonly searchTerm: string;
};

export type CustomerData = {
  readonly id: string;
  readonly name: string;
  readonly address: string | null;
  readonly phoneNumber: string | null;
  readonly status: "active" | "inactive";
  readonly createAt: string | null;
  readonly createBy: string | null;
};

export type CustomerMobileCardProps = {
  readonly customer: CustomerData;
  readonly isDetail?: boolean;
  readonly onEdit: (customer: CustomerData) => void;
  readonly onDetail: (customer: CustomerData) => void;
};

export type CustomerListApiState = {
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isEnvelopeError: boolean;
  readonly isMissingData: boolean;
  readonly paginatedData: CustomerData[];
  readonly totalPages: number;
  readonly totalCount: number;
};

export type CustomerCreatePayload = {
  readonly name: string;
  readonly address: string;
  readonly phone_number: string;
  readonly status: number;
};

export type MasterCustomerNavigation = {
  readonly goBack: () => void;
  readonly goCreate: () => void;
  readonly goEdit: (customer: CustomerData) => void;
  readonly goDetail: (customer: CustomerData) => void;
};

export type MasterCustomerPagination = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: CustomerData[];
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

export type MasterCustomerContainerState = {
  readonly pagination: MasterCustomerPagination;
  readonly isMoreOpen: boolean;
  readonly toggleMore: () => void;
  readonly handleCloseMore: () => void;
  readonly goDelete: () => void;
};

export type MasterCustomerProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: CustomerData[];
  readonly totalCount: number;
  readonly columns: TableColumn<CustomerData>[];
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
  readonly onEdit: (customer: CustomerData) => void;
  readonly onDetail: (customer: CustomerData) => void;
  readonly isDetail?: boolean;
  readonly onRowClick?: (customer: CustomerData) => void;
  readonly onBack: () => void;
  readonly onMore: () => void;
  readonly onCloseMore: () => void;
  readonly onDelete: () => void;
};

export type GetColumnsParams = {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly onEdit: (customer: CustomerData) => void;
};

