import type * as React from "react";

import type { TableColumn } from "../../components/Table";
import type { ApiEnvelope, PaginatedResponse } from "../../types/api.type";

export type ApiCategory = {
  readonly id: string;
  readonly category_name: string;
  readonly status: number;
  readonly created_at: string | null;
  readonly created_by: string | null;
  readonly updated_at: string | null;
};

export type CategoryListResponse = PaginatedResponse<ApiCategory>;
export type CategoryCreateResponse = ApiEnvelope<ApiCategory | null>;

export type CategoryListParams = {
  readonly pageNumber: number;
  readonly pageSize: number;
  readonly searchTerm: string;
};

export type CategoryData = {
  readonly id: string;
  readonly categoryName: string;
  readonly status: "active" | "inactive";
  readonly createAt: string;
  readonly createBy: string;
};

export type CategoryListApiState = {
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
  readonly isEnvelopeError: boolean;
  readonly isMissingData: boolean;
  readonly paginatedData: CategoryData[];
  readonly totalPages: number;
  readonly totalCount: number;
};

export type CategoryCreatePayload = {
  readonly category_name: string;
};

export type CategoryAllItem = {
  readonly id: string;
  readonly category_name: string;
};

export type CategoryAllResponse = ApiEnvelope<CategoryAllItem[]>;

export type CategorySelectState = {
  readonly categories: CategoryAllItem[];
  readonly isLoading: boolean;
  readonly errorMessage: string | null;
};

export type MasterCategoryNavigation = {
  readonly goBack: () => void;
  readonly goCreate: () => void;
  readonly goEdit: (category: CategoryData) => void;
  readonly goDetail: (category: CategoryData) => void;
};

export type MasterCategoryPagination = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: CategoryData[];
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

export type MasterCategoryContainerState = {
  readonly pagination: MasterCategoryPagination;
  readonly isMoreOpen: boolean;
  readonly toggleMore: () => void;
  readonly handleCloseMore: () => void;
  readonly goDelete: () => void;
};

export type MasterCategoryProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: readonly CategoryData[];
  readonly totalCount: number;
  readonly columns: readonly TableColumn<CategoryData>[];
  readonly isMoreOpen: boolean;
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
  readonly onEdit: (category: CategoryData) => void;
  readonly onRowClick: (category: CategoryData) => void;
  readonly onBack: () => void;
  readonly onMore: () => void;
  readonly onCloseMore: () => void;
  readonly onDelete: () => void;
};

export type GetColumnsParams = {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly onEdit: (category: CategoryData) => void;
  readonly onDelete: (category: CategoryData) => void;
};

export type ModalState = {
  readonly isModalOpen: boolean;
  readonly editingCategory: CategoryData | null;
  readonly openCreateModal: () => void;
  readonly openEditModal: (data: CategoryData) => void;
  readonly closeModal: () => void;
};

export type ConfirmModalState = {
  readonly isConfirmModalOpen: boolean;
  readonly deletingCategory: CategoryData | null;
  readonly openConfirmModal: (data: CategoryData) => void;
  readonly closeConfirmModal: () => void;
  readonly onConfirmDelete: () => void;
};

export type BaseCategoryState = ModalState & ConfirmModalState;

export type InputFieldProps = {
  readonly label: string;
  readonly placeholder: string;
  readonly value: string;
  readonly required?: boolean;
  readonly icon: React.ReactNode;
  readonly type?: string;
  readonly multiline?: boolean;
  readonly onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export type MasterCategoryCreateFormState = {
  readonly name: string;
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly successMessage: string | null;
  readonly handleNameChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readonly handleSubmit: (event: React.SyntheticEvent) => void;
  readonly goBack: () => void;
};
