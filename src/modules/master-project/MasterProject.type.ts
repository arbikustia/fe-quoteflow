import * as React from "react";
import type { MasterBase } from "../../types/master";
import type { TableColumn } from "../../components/Table";

export type ProjectItem = {
  itemId: string;
  qty: number;
};

export type ProjectData = MasterBase & {
  name: string;
  items: ProjectItem[];
  remark: string;
};

export type MasterProjectProps = {
  isModalOpen: boolean;
  isConfirmModalOpen: boolean;
  editingProject: ProjectData | null;
  deletingProject: ProjectData | null;
  openCreateModal: () => void;
  openEditModal: (project: ProjectData) => void;
  closeModal: () => void;
  openConfirmModal: (project: ProjectData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: ProjectData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
  columns: TableColumn<ProjectData>[];
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type ProjectActionProps = {
  row: ProjectData;
  onEdit: (project: ProjectData) => void;
  onConfirm: (project: ProjectData) => void;
};

export type ProjectFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingProject: ProjectData | null;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type ProjectToolbarProps = {
  pageSize: number;
  totalCount: number;
  changePageSize: (size: number) => void;
};

export type ModalState = {
  isModalOpen: boolean;
  editingProject: ProjectData | null;
  openCreateModal: () => void;
  openEditModal: (project: ProjectData) => void;
  closeModal: () => void;
};

export type ConfirmModalState = {
  isConfirmModalOpen: boolean;
  deletingProject: ProjectData | null;
  openConfirmModal: (project: ProjectData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
};

export type BaseProjectState = Omit<
  MasterProjectProps,
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
  onEdit: (project: ProjectData) => void;
  onConfirm: (project: ProjectData) => void;
};
