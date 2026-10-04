import * as React from "react";
import type { MasterBase } from "../../types/master";
import type { TableColumn } from "../../components/Table";

export type ItemData = MasterBase & {
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  duration: string;
  remark: string;
};

export type MasterItemProps = {
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
  MasterItemProps,
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

export type ItemFormFieldsProps = {
  editingItem: ItemData | null;
};
