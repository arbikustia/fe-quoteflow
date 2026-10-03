import * as React from "react";
import type { MasterBase } from "../../types/master";
import type { TableColumn } from "../../components/Table";

export type CategoryData = MasterBase & {
  categoryName: string;
};

export type MasterCategoryProps = {
  isModalOpen: boolean;
  isConfirmModalOpen: boolean;
  editingCategory: CategoryData | null;
  deletingCategory: CategoryData | null;
  openCreateModal: () => void;
  openEditModal: (category: CategoryData) => void;
  closeModal: () => void;
  openConfirmModal: (category: CategoryData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: CategoryData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
  columns: TableColumn<CategoryData>[];
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type CategoryFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingCategory: CategoryData | null;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type CategoryToolbarProps = {
  pageSize: number;
  totalCount: number;
  changePageSize: (size: number) => void;
};

export type CategoryActionProps = {
  row: CategoryData;
  onEdit: (category: CategoryData) => void;
  onConfirm: (category: CategoryData) => void;
};

export type ModalState = {
  isModalOpen: boolean;
  editingCategory: CategoryData | null;
  openCreateModal: () => void;
  openEditModal: (category: CategoryData) => void;
  closeModal: () => void;
};

export type ConfirmModalState = {
  isConfirmModalOpen: boolean;
  deletingCategory: CategoryData | null;
  openConfirmModal: (category: CategoryData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
};

export type BaseCategoryState = Omit<
  MasterCategoryProps,
  | "changePageSize"
  | "columns"
  | "currentPage"
  | "goToPage"
  | "nextPage"
  | "onSubmit"
  | "pageSize"
  | "paginatedData"
  | "prevPage"
  | "totalCount"
  | "totalPages"
>;

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (category: CategoryData) => void;
  onConfirm: (category: CategoryData) => void;
};
