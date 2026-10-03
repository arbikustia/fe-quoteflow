import { useState } from "react";
import type { BaseServiceTypeState, ServiceTypeData, ConfirmModalState, ModalState } from "./MasterServiceType.type";

const useModalState = (): ModalState => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceType, setEditingServiceType] = useState<ServiceTypeData | null>(null);

  const openCreateModal = (): void => {
    setEditingServiceType(null);
    setIsModalOpen(true);
  };

  const openEditModal = (serviceType: ServiceTypeData): void => {
    setEditingServiceType(serviceType);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setTimeout((): void => setEditingServiceType(null), 200);
  };

  return { isModalOpen, editingServiceType, openCreateModal, openEditModal, closeModal };
};

const useConfirmModalState = (): ConfirmModalState => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingServiceType, setDeletingServiceType] = useState<ServiceTypeData | null>(null);

  const openConfirmModal = (serviceType: ServiceTypeData): void => {
    setDeletingServiceType(serviceType);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = (): void => {
    setIsConfirmModalOpen(false);
    setTimeout((): void => setDeletingServiceType(null), 200);
  };

  const onConfirmDelete = (): void => {
    closeConfirmModal();
  };

  return { isConfirmModalOpen, deletingServiceType, openConfirmModal, closeConfirmModal, onConfirmDelete };
};

export const useMasterServiceTypeState = (): BaseServiceTypeState => {
  const modalState = useModalState();
  const confirmModalState = useConfirmModalState();
  return { ...modalState, ...confirmModalState };
};
