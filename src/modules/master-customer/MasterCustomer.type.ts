import type * as React from "react";
import type { MasterBase } from "../../types/master";
import type { TableColumn } from "../../components/Table";

export type CustomerData = MasterBase & {
  name: string;
  address: string;
  phoneNumber: string;
};

export type MasterCustomerProps = {
  isModalOpen: boolean;
  isConfirmModalOpen: boolean;
  editingCustomer: CustomerData | null;
  deletingCustomer: CustomerData | null;
  openCreateModal: () => void;
  openEditModal: (customer: CustomerData) => void;
  closeModal: () => void;
  openConfirmModal: (customer: CustomerData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: CustomerData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
  columns: TableColumn<CustomerData>[];
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type CustomerFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingCustomer: CustomerData | null;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type ModalState = {
  isModalOpen: boolean;
  editingCustomer: CustomerData | null;
  openCreateModal: () => void;
  openEditModal: (customer: CustomerData) => void;
  closeModal: () => void;
};

export type ConfirmModalState = {
  isConfirmModalOpen: boolean;
  deletingCustomer: CustomerData | null;
  openConfirmModal: (customer: CustomerData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
};

export type BaseCustomerState = ModalState & ConfirmModalState;

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (customer: CustomerData) => void;
  onConfirm: (customer: CustomerData) => void;
};
