import { useState } from "react";
import type { BaseCustomerState, CustomerData, ConfirmModalState, ModalState } from "./MasterCustomer.type";

const useModalState = (): ModalState => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerData | null>(null);

  const openCreateModal = (): void => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const openEditModal = (customer: CustomerData): void => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setTimeout((): void => setEditingCustomer(null), 200);
  };

  return { isModalOpen, editingCustomer, openCreateModal, openEditModal, closeModal };
};

const useConfirmModalState = (): ConfirmModalState => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState<CustomerData | null>(null);

  const openConfirmModal = (customer: CustomerData): void => {
    setDeletingCustomer(customer);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = (): void => {
    setIsConfirmModalOpen(false);
    setTimeout((): void => setDeletingCustomer(null), 200);
  };

  const onConfirmDelete = (): void => {
    closeConfirmModal();
  };

  return { isConfirmModalOpen, deletingCustomer, openConfirmModal, closeConfirmModal, onConfirmDelete };
};

export const useMasterCustomerState = (): BaseCustomerState => {
  const modalState = useModalState();
  const confirmModalState = useConfirmModalState();
  return { ...modalState, ...confirmModalState };
};
