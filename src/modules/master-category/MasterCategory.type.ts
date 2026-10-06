import type { TableColumn } from "../../components/Table";
import type { MasterBase } from "../../types/master";

/**
 * Category Data
 */
export type CategoryData = MasterBase & {
  readonly categoryName: string;
};

/**
 * Props for Category component
 */
export type MasterCategoryProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: readonly CategoryData[];
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
  readonly totalCount: number;
  readonly columns: readonly TableColumn<CategoryData>[];
  readonly onCreate: () => void;
  readonly onEdit: (category: CategoryData) => void;
  readonly onRowClick: (category: CategoryData) => void;
  
  readonly onMore?: () => void;
  readonly isMoreOpen?: boolean;
  readonly onCloseMore?: () => void;
  readonly onDelete?: () => void;
  readonly onBack: () => void;
};

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (category: CategoryData) => void;
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
