import type { ApiEnvelope, PaginatedResponse } from "../../types/api.type";

export type ApiCustomer = {
  id: string;
  name: string;
  address: string | null;
  phone_number: string | null;
  status: number;
  created_at: string | null;
  created_by: string | null;
};

export type CustomerAllResponse = {
  status: boolean;
  data: Array<{
    id: string;
    name: string;
    address: string;
    phone_number: string;
  }>;
  messages: string[];
};

export type CustomerListResponse = PaginatedResponse<ApiCustomer>;
export type CustomerCreateResponse = ApiEnvelope<ApiCustomer | null>;
export type CustomerUpdatePayload = {
  id: string;
  name: string;
  address: string;
  phone_number: string;
  status: number;
};
export type CustomerDetailResponse = ApiEnvelope<ApiCustomer | null>;

export type CustomerListParams = {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
};

export type CustomerData = {
  id: string;
  name: string;
  address: string | null;
  phoneNumber: string | null;
  status: "active" | "inactive";
  createAt: string | null;
  createBy: string | null;
};

export type CustomerMobileCardProps = {
  customer: CustomerData;
  onEdit: (customer: CustomerData) => void;
};

export type CustomerListApiState = {
  isLoading: boolean;
  errorMessage: string | null;
  isEnvelopeError: boolean;
  isMissingData: boolean;
  paginatedData: CustomerData[];
  totalPages: number;
  totalCount: number;
};

export type CustomerCreatePayload = {
  name: string;
  address: string;
  phone_number: string;
  status: number;
};

export type CustomerRouteState = {
  successMessage?: string;
};

export type MasterCustomerNavigation = {
  goBack: () => void;
  goCreate: () => void;
  goEdit: (customer: CustomerData) => void;
};

export type MasterCustomerPagination = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: CustomerData[];
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

export type MasterCustomerContainerState = {
  pagination: MasterCustomerPagination;
  isMoreOpen: boolean;
  toggleMore: () => void;
  handleCloseMore: () => void;
  goDelete: () => void;
};

export type MasterCustomerProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: CustomerData[];
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
  setSearchTerm: (searchTerm: string) => void;
  onCreate: () => void;
  successMessage?: string;
  onEdit: (customer: CustomerData) => void;
  onRowClick?: (customer: CustomerData) => void;
  onBack: () => void;
  onMore: () => void;
  onCloseMore: () => void;
  onDelete: () => void;
};

