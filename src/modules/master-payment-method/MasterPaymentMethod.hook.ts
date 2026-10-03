import { useState } from "react";
import type { BasePaymentMethodState, PaymentMethodData, ConfirmModalState, ModalState } from "./MasterPaymentMethod.type";

const useModalState = (): ModalState => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethodData | null>(null);

  const openCreateModal = (): void => {
    setEditingPaymentMethod(null);
    setIsModalOpen(true);
  };

  const openEditModal = (paymentMethod: PaymentMethodData): void => {
    setEditingPaymentMethod(paymentMethod);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setTimeout((): void => setEditingPaymentMethod(null), 200);
  };

  return { isModalOpen, editingPaymentMethod, openCreateModal, openEditModal, closeModal };
};

const useConfirmModalState = (): ConfirmModalState => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingPaymentMethod, setDeletingPaymentMethod] = useState<PaymentMethodData | null>(null);

  const openConfirmModal = (paymentMethod: PaymentMethodData): void => {
    setDeletingPaymentMethod(paymentMethod);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = (): void => {
    setIsConfirmModalOpen(false);
    setTimeout((): void => setDeletingPaymentMethod(null), 200);
  };

  const onConfirmDelete = (): void => {
    closeConfirmModal();
  };

  return { isConfirmModalOpen, deletingPaymentMethod, openConfirmModal, closeConfirmModal, onConfirmDelete };
};

export const useMasterPaymentMethodState = (): BasePaymentMethodState => {
  const modalState = useModalState();
  const confirmModalState = useConfirmModalState();
  return { ...modalState, ...confirmModalState };
};
