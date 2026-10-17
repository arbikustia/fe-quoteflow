import type { TableColumn } from "../../components/Table";
import type { ApiEnvelope, ApiQueryParams, PaginatedResponse } from "../../types/api.type";

export type ApiUser = {
  readonly id: string;
  readonly username: string | null;
  readonly email: string | null;
  readonly password: string | null;
  readonly role: string[] | null;
  readonly last_created: string | null;
};

export type UserListResponse = PaginatedResponse<ApiUser>;
export type UserDetailResponse = ApiEnvelope<ApiUser | ApiUser[] | null>;
export type UserCreateResponse = ApiEnvelope<ApiUser | null>;
export type UserListParams = ApiQueryParams;

export type UserCreatePayload = {
  readonly username: string;
  readonly email?: string | null;
  readonly password?: string;
  readonly role?: readonly string[];
  readonly status?: number;
};

export type UserUpdatePayload = {
  readonly id: string;
  readonly username?: string;
  readonly email?: string | null;
  readonly password?: string;
  readonly role?: readonly string[];
  readonly status?: number;
};

export type UserData = {
  readonly id: string;
  readonly username: string | null;
  readonly email: string | null;
  readonly role: string | null;
  readonly status: "active" | "inactive";
  readonly createAt: string | null;
  readonly createBy: string | null;
};

export type UserListApiState = {
  readonly paginatedData: UserData[];
  readonly totalPages: number;
  readonly totalCount: number;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly isMissingData: boolean;
};

export type MasterUserProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: readonly UserData[];
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
  readonly totalCount: number;
  readonly columns: readonly TableColumn<UserData>[];
  readonly isLoading: boolean;
  readonly isError: boolean;
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
export type MasterUserNavigation = {
  readonly goBack: () => void;
  readonly goCreate: () => void;
  readonly goEdit: (item: UserData) => void;
  readonly goDetail: (item: UserData) => void;
};

/** Container state hook return type */
export type MasterUserPagination = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: readonly UserData[];
  readonly totalCount: number;
  readonly isEmpty: boolean;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
  readonly setSearchTerm: (searchTerm: string) => void;
};

export type MasterUserContainerState = MasterUserNavigation & {
  readonly pagination: MasterUserPagination;
  readonly isMoreOpen: boolean;
  readonly toggleMore: () => void;
  readonly goDelete: () => void;
  readonly handleCloseMore: () => void;
};
