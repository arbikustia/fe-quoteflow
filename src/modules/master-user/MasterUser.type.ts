import type { TableColumn } from "../../components/Table";
import type { ApiEnvelope, PaginatedResponse } from "../../types/api.type";

export type ApiUser = {
  readonly id: string;
  readonly username: string;
  readonly password: string;
  readonly email: string;
  readonly last_created: string | null;
};

export type CreateUserResponseDto = {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly role: string;
};

export type UserListResponse = ApiEnvelope<PaginatedResponse<ApiUser>>;
export type UserCreateResponse = ApiEnvelope<CreateUserResponseDto | null>;

export type UserListParams = {
  readonly pageNumber: number;
  readonly pageSize: number;
  readonly searchTerm: string;
};

export type UserCreatePayload = {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly role: string;
};

export type UserData = {
  readonly id: string;
  readonly username: string;
  readonly role: "Admin" | "User" | null;
  readonly status: "active" | "inactive" | null;
  readonly createAt: string | null;
  readonly createBy: string | null;
};

export type UserListApiState = {
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isMissingData: boolean;
  readonly paginatedData: UserData[];
  readonly totalPages: number;
  readonly totalCount: number;
  readonly hasNext: boolean;
  readonly hasPrevious: boolean;
};

export type MasterUserProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: readonly UserData[];
  readonly totalCount: number;
  readonly columns: readonly TableColumn<UserData>[];
  readonly isLoading?: boolean;
  readonly errorMessage?: string | null;
  readonly isEmpty?: boolean;
  readonly isMissingData?: boolean;
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
  readonly onCreate: () => void;
  readonly onEdit: (user: UserData) => void;
  readonly onRowClick: (user: UserData) => void;
  readonly onMore?: () => void;
  readonly isMoreOpen?: boolean;
  readonly onCloseMore?: () => void;
  readonly onDelete?: () => void;
  readonly onBack: () => void;
};

export type GetColumnsParams = {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly onEdit: (user: UserData) => void;
};

export type MasterUserNavigation = {
  readonly goBack: () => void;
  readonly goCreate: () => void;
  readonly goEdit: (item: UserData) => void;
  readonly goDetail: (item: UserData) => void;
};

export type MasterUserPagination = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: UserData[];
  readonly totalCount: number;
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isEmpty: boolean;
  readonly isMissingData: boolean;
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
};

export type MasterUserContainerState = MasterUserNavigation & {
  readonly pagination: MasterUserPagination;
  readonly isMoreOpen: boolean;
  readonly toggleMore: () => void;
  readonly goDelete: () => void;
  readonly handleCloseMore: () => void;
};
