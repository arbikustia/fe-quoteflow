import type { ApiEnvelope, PaginatedResponse } from "../../types/api.type";
import type { MasterBase } from "../../types/master";

export type ApiServiceType = {
  id: string;
  name: string;
  price: number;
  is_active: boolean;
  status: number;
  created_at: string | null;
  updated_at: string | null;
  created_by?: string | null;
};

export type ServiceTypeListParams = {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
};

export type ServiceTypeAllResponse = ApiEnvelope<ApiServiceType[]>;
export type ServiceTypeListResponse = PaginatedResponse<ApiServiceType>;
export type ServiceTypeCreatePayload = {
  name: string;
  price: number;
  status: number;
};

export type ServiceTypeUpdatePayload = ServiceTypeCreatePayload & {
  id: string;
};
export type ServiceTypeCreateResponse = ApiEnvelope<ApiServiceType | null>;

export type ServiceTypeData = MasterBase & {
  name: string;
  price: number;
  isActive: boolean;
};

export type ServiceTypeListApiState = {
  isLoading: boolean;
  errorMessage: string | null;
  isMissingData: boolean;
  paginatedData: ServiceTypeData[];
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type MasterServiceTypeProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: ServiceTypeData[];
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
  onCreate: () => void;
  onEdit: (serviceType: ServiceTypeData) => void;
  onRowClick: (serviceType: ServiceTypeData) => void;
  onMore?: () => void;
  isMoreOpen?: boolean;
  onCloseMore?: () => void;
  onDelete?: () => void;
  onBack: () => void;
};

export type MasterServiceTypeNavigation = {
  goBack: () => void;
  goCreate: () => void;
  goEdit: (item: ServiceTypeData) => void;
  goDetail: (item: ServiceTypeData) => void;
};

export type MasterServiceTypePagination = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: ServiceTypeData[];
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

export type MasterServiceTypeContainerState = MasterServiceTypeNavigation & {
  pagination: MasterServiceTypePagination;
  isMoreOpen: boolean;
  toggleMore: () => void;
  goDelete: () => void;
  handleCloseMore: () => void;
};
