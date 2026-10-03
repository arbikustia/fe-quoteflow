import { useState } from "react";
import type { BasePaymentTypeState, PaymentTypeData, ConfirmModalState, ModalState } from "./MasterPaymentType.type";

const useModalState = (): ModalState => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPaymentType, setEditingPaymentType] = useState<PaymentTypeData | null>(null);
  const openCreateModal = (): void => { setEditingPaymentType(null); setIsModalOpen(true); };
  const openEditModal = (data: PaymentTypeData): void => { setEditingPaymentType(data); setIsModalOpen(true); };
  const closeModal = (): void => { setIsModalOpen(false); setTimeout(() => setEditingPaymentType(null), 200); };
  return { isModalOpen, editingPaymentType, openCreateModal, openEditModal, closeModal };
};

const useConfirmModalState = (): ConfirmModalState => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingPaymentType, setDeletingPaymentType] = useState<PaymentTypeData | null>(null);
  const openConfirmModal = (data: PaymentTypeData): void => { setDeletingPaymentType(data); setIsConfirmModalOpen(true); };
  const closeConfirmModal = (): void => { setIsConfirmModalOpen(false); setTimeout(() => setDeletingPaymentType(null), 200); };
  const onConfirmDelete = (): void => { closeConfirmModal(); };
  return { isConfirmModalOpen, deletingPaymentType, openConfirmModal, closeConfirmModal, onConfirmDelete };
};

/**
 * Master Payment Type State Hook
 * @returns {BasePaymentTypeState} state
 */
export const useMasterPaymentTypeState = (): BasePaymentTypeState => {
  return { ...useModalState(), ...useConfirmModalState() };
};
