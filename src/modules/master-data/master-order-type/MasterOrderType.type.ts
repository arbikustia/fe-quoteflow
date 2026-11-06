import type { ApiEnvelope, PaginatedResponse } from "../../../types/api.type";

export type ApiOrderType = {
  id: string;
  name: string;
  is_handover: boolean;
  status: number;
  created_at: string | null;
  updated_at: string | null;
  created_by?: string | null;
  updated_by?: string | null;
};

export type OrderTypeAllResponse = {
  status: boolean;
  data: Array<{
    id: string;
    name: string;
    is_handover: boolean;
  }>;
  messages: string[];
};

export type OrderTypeListResponse = PaginatedResponse<ApiOrderType>;
export type OrderTypeCreateResponse = ApiEnvelope<ApiOrderType | null>;
export type OrderTypeDetailResponse = ApiEnvelope<ApiOrderType | null>;

export type OrderTypeCreatePayload = {
  name: string;
  is_handover: boolean;
  status: number;
};

export type OrderTypeUpdatePayload = {
  id: string;
  name: string;
  is_handover: boolean;
  status: number;
};

export type OrderTypeListParams = {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
};

export type OrderTypeData = {
  id: string;
  name: string;
  isHandover: boolean;
  status: "active" | "inactive";
  createAt: string | null;
  createBy: string | null;
};

export type OrderTypeMobileCardProps = {
  orderType: OrderTypeData;
  onEdit: (orderType: OrderTypeData) => void;
};

export type OrderTypeListApiState = {
  isLoading: boolean;
  errorMessage: string | null;
  isEnvelopeError: boolean;
  isMissingData: boolean;
  paginatedData: OrderTypeData[];
  totalPages: number;
  totalCount: number;
};

export type OrderTypeRouteState = {
  successMessage?: string;
};

export type MasterOrderTypeNavigation = {
  goBack: () => void;
  goCreate: () => void;
  goEdit: (orderType: OrderTypeData) => void;
};

export type MasterOrderTypePagination = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: OrderTypeData[];
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

export type MasterOrderTypeContainerState = {
  pagination: MasterOrderTypePagination;
  isMoreOpen: boolean;
  toggleMore: () => void;
  handleCloseMore: () => void;
  goDelete: () => void;
};

export type MasterOrderTypeProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: OrderTypeData[];
  totalCount: number;
  isMoreOpen: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  isEmpty: boolean;
  isMissingData: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  onRowClick?: (record: OrderTypeData) => void;
  onBack: () => void;
  onCreate: () => void;
  onEdit: (orderType: OrderTypeData) => void;
  onMore: () => void;
  onCloseMore: () => void;
  onDelete: () => void;
  setSearchTerm: (searchTerm: string) => void;
};
