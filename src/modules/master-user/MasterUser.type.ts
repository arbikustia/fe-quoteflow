import type { ApiEnvelope, ApiQueryParams, PaginatedResponse } from "../../types/api.type";

export type ApiUser = {
  id: string;
  username: string | null;
  email: string | null;
  password: string | null;
  role: string | string[] | null;
  status?: number;
  last_created: string | null;
};

export type UserListResponse = PaginatedResponse<ApiUser>;
export type UserDetailResponse = ApiEnvelope<ApiUser | ApiUser[] | null>;
export type UserCreateResponse = ApiEnvelope<ApiUser | null>;
export type UserListParams = ApiQueryParams;

export type UserCreatePayload = {
  username: string;
  email?: string | null;
  password?: string;
  role?: string[];
  status?: number;
};

export type UserUpdatePayload = {
  id: string;
  username?: string;
  email?: string | null;
  password?: string;
  role?: string[];
  status?: number;
};

export type UserData = {
  id: string;
  username: string | null;
  email: string | null;
  role: string | null;
  status: "active" | "inactive";
  createAt: string | null;
  createBy: string | null;
};

export type UserListApiState = {
  paginatedData: UserData[];
  totalPages: number;
  totalCount: number;
  isLoading: boolean;
  isError: boolean;
  isMissingData: boolean;
};

export type MasterUserProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: UserData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  setSearchTerm: (searchTerm: string) => void;
  onCreate: () => void;
  onEdit: (user: UserData) => void;
  onRowClick: (user: UserData) => void;
  
  onMore?: () => void;
  isMoreOpen?: boolean;
  onCloseMore?: () => void;
  onDelete?: () => void;
  onBack: () => void;
};

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (user: UserData) => void;
};

/** Navigation hook return type */
export type UserRouteState = {
  user?: UserData;
  successMessage?: string;
};

export type MasterUserNavigation = {
  goBack: () => void;
  goCreate: () => void;
  goEdit: (item: UserData) => void;
};

/** Container state hook return type */
export type MasterUserPagination = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: UserData[];
  totalCount: number;
  isEmpty: boolean;
  isLoading: boolean;
  isError: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  setSearchTerm: (searchTerm: string) => void;
};

export type MasterUserContainerState = MasterUserNavigation & {
  pagination: MasterUserPagination;
  isMoreOpen: boolean;
  toggleMore: () => void;
  goDelete: () => void;
  handleCloseMore: () => void;
};
