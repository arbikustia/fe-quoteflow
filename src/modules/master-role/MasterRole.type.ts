import * as React from "react";
import type { MasterBase } from "../../types/master";
import type { TableColumn } from "../../components/Table";

export type RoleData = MasterBase & {
  roleName: string;
};

export type MasterRoleProps = {
  isModalOpen: boolean;
  isConfirmModalOpen: boolean;
  editingRole: RoleData | null;
  deletingRole: RoleData | null;
  openCreateModal: () => void;
  openEditModal: (role: RoleData) => void;
  closeModal: () => void;
  openConfirmModal: (role: RoleData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: RoleData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
  columns: TableColumn<RoleData>[];
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type RoleFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingRole: RoleData | null;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type RoleToolbarProps = {
  pageSize: number;
  totalCount: number;
  changePageSize: (size: number) => void;
};

export type RoleActionProps = {
  row: RoleData;
  onEdit: (role: RoleData) => void;
  onConfirm: (role: RoleData) => void;
};

export type ModalState = {
  isModalOpen: boolean;
  editingRole: RoleData | null;
  openCreateModal: () => void;
  openEditModal: (role: RoleData) => void;
  closeModal: () => void;
};

export type ConfirmModalState = {
  isConfirmModalOpen: boolean;
  deletingRole: RoleData | null;
  openConfirmModal: (role: RoleData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
};

export type BaseRoleState = Omit<
  MasterRoleProps,
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
  onEdit: (role: RoleData) => void;
  onConfirm: (role: RoleData) => void;
};
