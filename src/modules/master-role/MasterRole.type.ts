import type * as React from "react";

import type { ApiEnvelope, PaginatedResponse } from "../../types/api.type";

export type ApiRole = {
  id: string;
  role: string;
  status: number;
  last_created: string | null;
};

export type RoleOption = {
  id: string;
  role: string;
  status: number;
};

export type RoleSelectState = {
  roles: RoleOption[];
  isLoading: boolean;
  errorMessage: string | null;
};

export type RoleAllResponse = {
  status: boolean;
  data: RoleOption[];
  messages: string[] | string | null;
};

export type RoleListResponse = PaginatedResponse<ApiRole>;
export type RoleCreateResponse = ApiEnvelope<ApiRole | null>;
export type RoleDetailResponse = ApiEnvelope<ApiRole | ApiRole[] | null>;

export type RoleFormValues = {
  roleName: string;
  isActive: boolean;
};

export type RoleRouteState = {
  role?: RoleData;
  successMessage?: string;
};

export type RoleSubmissionParams = {
  id: string | undefined;
  isEditMode: boolean;
  isActive: boolean;
  getValues: () => RoleFormValues;
  validateForm: () => Promise<boolean>;
};

export type RoleFormValidation = {
  errors: import("react-hook-form").FieldErrors<RoleFormValues>;
  isSubmitted: boolean;
};

export type RoleSubmissionState = {
  isSubmitting: boolean;
  errorMessage: string | null;
  handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
};

export type RoleFormFieldsState = RoleFormValues & RoleFormValidation & {
  getValues: () => RoleFormValues;
  validateForm: () => Promise<boolean>;
  handleRoleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: () => void;
};

export type RoleListParams = {
  pageNumber: number;
  pageSize: number;
  searchTerm: string;
};

export type RoleData = {
  id: string;
  roleName: string;
  status: "active" | "inactive";
  createAt: string | null;
  createBy: string | null;
};

export type RoleListApiState = {
  isLoading: boolean;
  errorMessage: string | null;
  isMissingData: boolean;
  paginatedData: RoleData[];
  totalPages: number;
  totalCount: number;
};

export type RoleCreatePayload = {
  role: string;
  status: number;
};

export type RoleUpdatePayload = RoleCreatePayload & {
  id: string;
};

export type MasterRoleCreateFormState = {
  roleName: string;
  isActive: boolean;
  isEditMode: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  handleRoleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: () => void;
  handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
  goBack: () => void;
};

export type MasterRoleNavigation = {
  goBack: () => void;
  goCreate: () => void;
  goEdit: (item: RoleData) => void;
};

export type MasterRolePagination = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: RoleData[];
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

export type MasterRoleContainerState = MasterRoleNavigation & {
  pagination: MasterRolePagination;
  isMoreOpen: boolean;
  toggleMore: () => void;
  goDelete: () => void;
  handleCloseMore: () => void;
};

export type MasterRoleProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: RoleData[];
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
  onEdit: (role: RoleData) => void;
  onRowClick: (role: RoleData) => void;
  onBack: () => void;
  onMore?: () => void;
  isMoreOpen?: boolean;
  onCloseMore?: () => void;
  onDelete?: () => void;
};
