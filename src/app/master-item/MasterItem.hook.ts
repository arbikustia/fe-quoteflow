import { useState } from 'react';
import type { ItemData } from './MasterItem.type';

export const useMasterItemState = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemData | null>(null);
  const [deletingItem, setDeletingItem] = useState<ItemData | null>(null);

  const openCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: ItemData) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingItem(null), 200);
  };

  const openConfirmModal = (item: ItemData) => {
    setDeletingItem(item);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setTimeout(() => setDeletingItem(null), 200);
  };

  const onConfirmDelete = () => {
    console.log("Delete item:", deletingItem?.name);
  };

  return {
    isModalOpen,
    isConfirmModalOpen,
    editingItem,
    deletingItem,
    openCreateModal,
    openEditModal,
    closeModal,
    openConfirmModal,
    closeConfirmModal,
    onConfirmDelete,
  };
};
