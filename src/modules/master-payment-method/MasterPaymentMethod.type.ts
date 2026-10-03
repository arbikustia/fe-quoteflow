import type * as React from "react";
import type { MasterBase } from "../../types/master";
import type { TableColumn } from "../../components/Table";

export type PaymentMethodData = MasterBase & {
  name: string;
  description: string;
};

export type MasterPaymentMethodProps = {
  isModalOpen: boolean;
  isConfirmModalOpen: boolean;
  editingPaymentMethod: PaymentMethodData | null;
  deletingPaymentMethod: PaymentMethodData | null;
  openCreateModal: () => void;
  openEditModal: (paymentMethod: PaymentMethodData) => void;
  closeModal: () => void;
  openConfirmModal: (paymentMethod: PaymentMethodData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: PaymentMethodData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
  columns: TableColumn<PaymentMethodData>[];
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type PaymentMethodFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingPaymentMethod: PaymentMethodData | null;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type ModalState = {
  isModalOpen: boolean;
  editingPaymentMethod: PaymentMethodData | null;
  openCreateModal: () => void;
  openEditModal: (paymentMethod: PaymentMethodData) => void;
  closeModal: () => void;
};

export type ConfirmModalState = {
  isConfirmModalOpen: boolean;
  deletingPaymentMethod: PaymentMethodData | null;
  openConfirmModal: (paymentMethod: PaymentMethodData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
};

export type BasePaymentMethodState = ModalState & ConfirmModalState;

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (paymentMethod: PaymentMethodData) => void;
  onConfirm: (paymentMethod: PaymentMethodData) => void;
};
