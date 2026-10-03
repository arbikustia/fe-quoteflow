import { useState } from "react";
import type { BaseVoucherState, VoucherData, ConfirmModalState, ModalState } from "./MasterVoucher.type";

const useModalState = (): ModalState => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<VoucherData | null>(null);
  const openCreateModal = (): void => { setEditingVoucher(null); setIsModalOpen(true); };
  const openEditModal = (data: VoucherData): void => { setEditingVoucher(data); setIsModalOpen(true); };
  const closeModal = (): void => { setIsModalOpen(false); setTimeout(() => setEditingVoucher(null), 200); };
  return { isModalOpen, editingVoucher, openCreateModal, openEditModal, closeModal };
};

const useConfirmModalState = (): ConfirmModalState => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingVoucher, setDeletingVoucher] = useState<VoucherData | null>(null);
  const openConfirmModal = (data: VoucherData): void => { setDeletingVoucher(data); setIsConfirmModalOpen(true); };
  const closeConfirmModal = (): void => { setIsConfirmModalOpen(false); setTimeout(() => setDeletingVoucher(null), 200); };
  const onConfirmDelete = (): void => { closeConfirmModal(); };
  return { isConfirmModalOpen, deletingVoucher, openConfirmModal, closeConfirmModal, onConfirmDelete };
};

/**
 * Master Voucher State Hook
 * @returns {BaseVoucherState} state
 */
export const useMasterVoucherState = (): BaseVoucherState => {
  return { ...useModalState(), ...useConfirmModalState() };
};
