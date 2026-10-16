import type { TableColumn } from "../../components/Table";
import type { ApiEnvelope, PaginatedResponse } from "../../types/api.type";
import type { MasterBase } from "../../types/master";

export type ApiServiceType = {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly is_active: boolean;
  readonly status: number;
  readonly created_at: string | null;
  readonly updated_at: string | null;
  readonly created_by?: string | null;
};

export type ServiceTypeListParams = {
  readonly pageNumber: number;
  readonly pageSize: number;
  readonly searchTerm: string;
};

export type ServiceTypeListResponse = PaginatedResponse<ApiServiceType>;
export type ServiceTypeCreatePayload = {
  readonly name: string;
  readonly price: number;
  readonly status: number;
};

export type ServiceTypeUpdatePayload = ServiceTypeCreatePayload & {
  readonly id: string;
};
export type ServiceTypeCreateResponse = ApiEnvelope<ApiServiceType | null>;

export type ServiceTypeData = MasterBase & {
  name: string;
  price: number;
  isActive: boolean;
};

export type ServiceTypeListApiState = {
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isMissingData: boolean;
  readonly paginatedData: ServiceTypeData[];
  readonly totalPages: number;
  readonly totalCount: number;
  readonly hasNext: boolean;
  readonly hasPrevious: boolean;
};

export type MasterServiceTypeProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: readonly ServiceTypeData[];
  readonly totalCount: number;
  readonly columns: readonly TableColumn<ServiceTypeData>[];
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isEmpty: boolean;
  readonly isMissingData: boolean;
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
  readonly setSearchTerm: (searchTerm: string) => void;
  onCreate: () => void;
  onEdit: (serviceType: ServiceTypeData) => void;
  onRowClick: (serviceType: ServiceTypeData) => void;
  onMore?: () => void;
  isMoreOpen?: boolean;
  onCloseMore?: () => void;
  onDelete?: () => void;
  onBack: () => void;
};

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (serviceType: ServiceTypeData) => void;
};

export type MasterServiceTypeNavigation = {
  readonly goBack: () => void;
  readonly goCreate: () => void;
  readonly goEdit: (item: ServiceTypeData) => void;
  readonly goDetail: (item: ServiceTypeData) => void;
};

export type MasterServiceTypePagination = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: ServiceTypeData[];
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

export type MasterServiceTypeContainerState = MasterServiceTypeNavigation & {
  readonly pagination: MasterServiceTypePagination;
  readonly isMoreOpen: boolean;
  readonly toggleMore: () => void;
  readonly goDelete: () => void;
  readonly handleCloseMore: () => void;
};
