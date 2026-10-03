import * as React from "react";
import type { MasterBase } from "../../types/master";
import type { TableColumn } from "../../components/Table";

export type VoucherData = MasterBase & {
  code: string;
  discountPercent: number;
};

export type MasterVoucherProps = {
  isModalOpen: boolean;
  isConfirmModalOpen: boolean;
  editingVoucher: VoucherData | null;
  deletingVoucher: VoucherData | null;
  openCreateModal: () => void;
  openEditModal: (voucher: VoucherData) => void;
  closeModal: () => void;
  openConfirmModal: (voucher: VoucherData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: VoucherData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
  columns: TableColumn<VoucherData>[];
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type VoucherFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingVoucher: VoucherData | null;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
};

export type VoucherToolbarProps = {
  pageSize: number;
  totalCount: number;
  changePageSize: (size: number) => void;
};

export type VoucherActionProps = {
  row: VoucherData;
  onEdit: (voucher: VoucherData) => void;
  onConfirm: (voucher: VoucherData) => void;
};

export type ModalState = {
  isModalOpen: boolean;
  editingVoucher: VoucherData | null;
  openCreateModal: () => void;
  openEditModal: (voucher: VoucherData) => void;
  closeModal: () => void;
};

export type ConfirmModalState = {
  isConfirmModalOpen: boolean;
  deletingVoucher: VoucherData | null;
  openConfirmModal: (voucher: VoucherData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
};

export type BaseVoucherState = Omit<
  MasterVoucherProps,
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
  onEdit: (voucher: VoucherData) => void;
  onConfirm: (voucher: VoucherData) => void;
};
