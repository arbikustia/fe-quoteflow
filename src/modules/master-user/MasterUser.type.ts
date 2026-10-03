import type * as React from "react";
import type { MasterBase } from "../../types/master";
import type { TableColumn } from "../../components/Table";

export type UserRole = "Admin" | "User";

export type UserData = MasterBase & {
  username: string;
  role: UserRole;
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

export type UserFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingUser: UserData | null;
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

export type BaseUserState = ModalState & ConfirmModalState;

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (user: UserData) => void;
  onConfirm: (user: UserData) => void;
};
