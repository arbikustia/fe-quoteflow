import * as React from "react";
import type { MasterBase } from "../../types/master";
import type { TableColumn } from "../../components/Table";

export type PaymentTypeData = MasterBase & {
  name: string;
};

export type MasterPaymentTypeProps = {
  isModalOpen: boolean;
  isConfirmModalOpen: boolean;
  editingPaymentType: PaymentTypeData | null;
  deletingPaymentType: PaymentTypeData | null;
  openCreateModal: () => void;
  openEditModal: (payment-type: PaymentTypeData) => void;
  closeModal: () => void;
  openConfirmModal: (payment-type: PaymentTypeData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: PaymentTypeData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
  columns: TableColumn<PaymentTypeData>[];
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type PaymentTypeFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingPaymentType: PaymentTypeData | null;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type PaymentTypeToolbarProps = {
  pageSize: number;
  totalCount: number;
  changePageSize: (size: number) => void;
};

export type PaymentTypeActionProps = {
  row: PaymentTypeData;
  onEdit: (payment-type: PaymentTypeData) => void;
  onConfirm: (payment-type: PaymentTypeData) => void;
};

export type ModalState = {
  isModalOpen: boolean;
  editingPaymentType: PaymentTypeData | null;
  openCreateModal: () => void;
  openEditModal: (payment-type: PaymentTypeData) => void;
  closeModal: () => void;
};

export type ConfirmModalState = {
  isConfirmModalOpen: boolean;
  deletingPaymentType: PaymentTypeData | null;
  openConfirmModal: (payment-type: PaymentTypeData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
};

export type BasePaymentTypeState = Omit<
  MasterPaymentTypeProps,
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
  onEdit: (payment-type: PaymentTypeData) => void;
  onConfirm: (payment-type: PaymentTypeData) => void;
};
