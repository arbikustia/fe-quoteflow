import type * as React from "react";
import type { MasterBase } from "../../types/master";
import type { TableColumn } from "../../components/Table";

export type ServiceTypeData = MasterBase & {
  name: string;
  price: number;
  isActive: boolean;
};

export type MasterServiceTypeProps = {
  isModalOpen: boolean;
  isConfirmModalOpen: boolean;
  editingServiceType: ServiceTypeData | null;
  deletingServiceType: ServiceTypeData | null;
  openCreateModal: () => void;
  openEditModal: (serviceType: ServiceTypeData) => void;
  closeModal: () => void;
  openConfirmModal: (serviceType: ServiceTypeData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: ServiceTypeData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
  columns: TableColumn<ServiceTypeData>[];
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type ServiceTypeFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingServiceType: ServiceTypeData | null;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type ModalState = {
  isModalOpen: boolean;
  editingServiceType: ServiceTypeData | null;
  openCreateModal: () => void;
  openEditModal: (serviceType: ServiceTypeData) => void;
  closeModal: () => void;
};

export type ConfirmModalState = {
  isConfirmModalOpen: boolean;
  deletingServiceType: ServiceTypeData | null;
  openConfirmModal: (serviceType: ServiceTypeData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
};

export type BaseServiceTypeState = ModalState & ConfirmModalState;

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (serviceType: ServiceTypeData) => void;
  onConfirm: (serviceType: ServiceTypeData) => void;
};
