import * as React from "react";

import type { TableColumn } from "../../components/Table";

export type UserData = {
  id: string;
  username: string;
  role: string;
};

export type MasterUserProps = {
  isModalOpen: boolean;
  isConfirmModalOpen: boolean;
  editingUser: UserData | null;
  deletingUser: UserData | null;
  openCreateModal: () => void;
  openEditModal: (user: UserData) => void;
  closeModal: () => void;
  openConfirmModal: (user: UserData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: UserData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
  columns: TableColumn<UserData>[];
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type ModalState = {
  isModalOpen: boolean;
  editingUser: UserData | null;
  openCreateModal: () => void;
  openEditModal: (user: UserData) => void;
  closeModal: () => void;
};

export type ConfirmModalState = {
  isConfirmModalOpen: boolean;
  deletingUser: UserData | null;
  openConfirmModal: (user: UserData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
};

export type BaseUserState = Omit<
  MasterUserProps,
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
  onEdit: (user: UserData) => void;
  onConfirm: (user: UserData) => void;
};

export type UserActionProps = {
  row: UserData;
  onEdit: (user: UserData) => void;
  onConfirm: (user: UserData) => void;
};

export type UserFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingUser: UserData | null;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type UserToolbarProps = {
  pageSize: number;
  totalCount: number;
  changePageSize: (size: number) => void;
};
