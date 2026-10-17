import type * as React from "react";

import type { TableColumn } from "../../components/Table";
import type { ApiEnvelope, PaginatedResponse } from "../../types/api.type";

export type ApiRole = {
  readonly id: string;
  readonly role: string;
  readonly last_created: string | null;
};

export type RoleListResponse = PaginatedResponse<ApiRole>;
export type RoleCreateResponse = ApiEnvelope<ApiRole | null>;
export type RoleDetailResponse = ApiEnvelope<ApiRole | ApiRole[] | null>;

export type RoleSubmissionParams = {
  readonly id: string | undefined;
  readonly isEditMode: boolean;
  readonly roleName: string;
  readonly isActive: boolean;
};

export type RoleSubmissionState = {
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
};

export type RoleFormFieldsState = {
  readonly roleName: string;
  readonly isActive: boolean;
  readonly handleRoleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleStatusChange: () => void;
};

export type RoleListParams = {
  readonly pageNumber: number;
  readonly pageSize: number;
  readonly searchTerm: string;
};

export type RoleData = {
  readonly id: string;
  readonly roleName: string;
  readonly status: "active" | "inactive";
  readonly createAt: string | null;
  readonly createBy: string | null;
};

export type RoleListApiState = {
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isMissingData: boolean;
  readonly paginatedData: RoleData[];
  readonly totalPages: number;
  readonly totalCount: number;
};

export type RoleCreatePayload = {
  readonly role: string;
  readonly status: number;
};

export type RoleUpdatePayload = RoleCreatePayload & {
  readonly id: string;
};

export type MasterRoleCreateFormState = {
  readonly roleName: string;
  readonly isActive: boolean;
  readonly isEditMode: boolean;
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly handleRoleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleStatusChange: () => void;
  readonly handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
  readonly goBack: () => void;
};

export type MasterRoleNavigation = {
  readonly goBack: () => void;
  readonly goCreate: () => void;
  readonly goEdit: (item: RoleData) => void;
  readonly goDetail: (item: RoleData) => void;
};

export type MasterRolePagination = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: readonly RoleData[];
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

export type MasterRoleContainerState = MasterRoleNavigation & {
  readonly pagination: MasterRolePagination;
  readonly isMoreOpen: boolean;
  readonly toggleMore: () => void;
  readonly goDelete: () => void;
  readonly handleCloseMore: () => void;
};

export type MasterRoleProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: readonly RoleData[];
  readonly totalCount: number;
  readonly columns: readonly TableColumn<RoleData>[];
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
  readonly onEdit: (role: RoleData) => void;
  readonly onRowClick: (role: RoleData) => void;
  readonly onBack: () => void;
  readonly onMore?: () => void;
  readonly isMoreOpen?: boolean;
  readonly onCloseMore?: () => void;
  readonly onDelete?: () => void;
};

export type GetColumnsParams = {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly onEdit: (role: RoleData) => void;
};
