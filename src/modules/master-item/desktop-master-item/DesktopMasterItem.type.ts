import * as React from "react";

import type { TableColumn } from "../../../components/Table";

export type ItemData = {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  remark: string;
};

export type ItemFormFieldsProps = {
  editingItem: ItemData | null;
};

export type ItemHeaderProps = {
  openCreateModal: () => void;
};

export type DesktopMasterItemProps = {
  isModalOpen: boolean;
  isConfirmModalOpen: boolean;
  editingItem: ItemData | null;
  deletingItem: ItemData | null;
  openCreateModal: () => void;
  openEditModal: (item: ItemData) => void;
  closeModal: () => void;
  openConfirmModal: (item: ItemData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: ItemData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
  columns: TableColumn<ItemData>[];
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type ModalState = {
  isModalOpen: boolean;
  editingItem: ItemData | null;
  openCreateModal: () => void;
  openEditModal: (item: ItemData) => void;
  closeModal: () => void;
};

export type ConfirmModalState = {
  isConfirmModalOpen: boolean;
  deletingItem: ItemData | null;
  openConfirmModal: (item: ItemData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
};

export type BaseItemState = Omit<
  DesktopMasterItemProps,
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
  onEdit: (item: ItemData) => void;
  onConfirm: (item: ItemData) => void;
};

export type ItemActionProps = {
  row: ItemData;
  onEdit: (item: ItemData) => void;
  onConfirm: (item: ItemData) => void;
};

export type ItemFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingItem: ItemData | null;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type ItemToolbarProps = {
  pageSize: number;
  totalCount: number;
  changePageSize: (size: number) => void;
};
