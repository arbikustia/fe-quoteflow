import { useState } from "react";
import type { BaseItemState, ConfirmModalState, ItemData, ModalState } from "./MasterItem.type";

const useModalState = (): ModalState => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemData | null>(null);

  const openCreateModal = (): void => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: ItemData): void => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setTimeout((): void => setEditingItem(null), 200);
  };

  return { isModalOpen, editingItem, openCreateModal, openEditModal, closeModal };
};

const useConfirmModalState = (): ConfirmModalState => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<ItemData | null>(null);

  const openConfirmModal = (item: ItemData): void => {
    setDeletingItem(item);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = (): void => {
    setIsConfirmModalOpen(false);
    setTimeout((): void => setDeletingItem(null), 200);
  };

  const onConfirmDelete = (): void => {
    closeConfirmModal();
  };

  return { isConfirmModalOpen, deletingItem, openConfirmModal, closeConfirmModal, onConfirmDelete };
};

export const useMasterItemState = (): BaseItemState => {
  const modalState = useModalState();
  const confirmModalState = useConfirmModalState();
  return { ...modalState, ...confirmModalState };
};
