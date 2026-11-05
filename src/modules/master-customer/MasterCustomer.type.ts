import type { PaginatedResponse } from "../../types/api.type";

export type ApiCustomer = {
  id: string;
  name: string;
  email?: string;
  address?: string;
  phone_number?: string;
  status: number;
  created_at?: string;
  created_by?: string;
};

export type CustomerAllResponse = {
  status: boolean;
  data: Array<{
    id: string;
    name: string;
    email?: string;
    address: string;
    phone_number: string;
  }>;
  messages: string[];
};

export type CustomerListResponse = PaginatedResponse<ApiCustomer>;
export type CustomerCreateResponse = {
  status: boolean;
  data?: ApiCustomer;
  messages?: string[] | string;
};
export type CustomerUpdatePayload = {
  id: string;
  name: string;
  email: string;
  address: string;
  phone_number: string;
  status: number;
};
export type CustomerListParams = {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
};

export type CustomerData = {
  id: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  status: "active" | "inactive";
  createAt: string;
  createBy: string;
};

export type CustomerMobileCardProps = {
  customer: CustomerData;
  onEdit: (customer: CustomerData) => void;
};

export type CustomerListApiState = {
  isLoading: boolean;
  errorMessage?: string;
  isMissingData: boolean;
  paginatedData: CustomerData[];
  totalPages: number;
  totalCount: number;
};

export type CustomerCreatePayload = {
  name: string;
  email: string;
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
  errorMessage?: string;
  isEmpty: boolean;
  isMissingData: boolean;
  goToPage: (page: number) => void;
  changePageSize: (size: number) => void;
  setSearchTerm: (searchTerm: string) => void;
};

export type MasterCustomerProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: CustomerData[];
  totalCount: number;
  isLoading: boolean;
  errorMessage?: string;
  isEmpty: boolean;
  isMissingData: boolean;
  goToPage: (page: number) => void;
  changePageSize: (size: number) => void;
  setSearchTerm: (searchTerm: string) => void;
  onCreate: () => void;
  onEdit: (customer: CustomerData) => void;
  onRowClick?: (customer: CustomerData) => void;
  onBack: () => void;
};

