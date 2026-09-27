import { useState } from "react";

import type { BaseItemState, ConfirmModalState, ItemData, ModalState } from "./MasterItem.type";

/**
 * Modal state hook
 * @returns {ModalState} modal state
 */
const useModalState = (): ModalState => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemData | null>(null);

  /**
   * Open create modal
   * @returns {void} void
   */
  const openCreateModal = (): void => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  /**
   * Open edit modal
   * @param {ItemData} item - item data
   * @returns {void} void
   */
  const openEditModal = (item: ItemData): void => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  /**
   * Close modal
   * @returns {void} void
   */
  const closeModal = (): void => {
    setIsModalOpen(false);
    setTimeout((): void => setEditingItem(null), 200);
  };

  return {
    isModalOpen,
    editingItem,
    openCreateModal,
    openEditModal,
    closeModal,
  };
};

/**
 * Confirm modal state hook
 * @returns {ConfirmModalState} confirm modal state
 */
const useConfirmModalState = (): ConfirmModalState => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<ItemData | null>(null);

  /**
   * Open confirm modal
   * @param {ItemData} item - item data
   * @returns {void} void
   */
  const openConfirmModal = (item: ItemData): void => {
    setDeletingItem(item);
    setIsConfirmModalOpen(true);
  };

  /**
   * Close confirm modal
   * @returns {void} void
   */
  const closeConfirmModal = (): void => {
    setIsConfirmModalOpen(false);
    setTimeout((): void => setDeletingItem(null), 200);
  };

  /**
   * On confirm delete
   * @returns {void} void
   */
  const onConfirmDelete = (): void => {
    // Note: implement real delete API here
    closeConfirmModal();
  };

  return {
    isConfirmModalOpen,
    deletingItem,
    openConfirmModal,
    closeConfirmModal,
    onConfirmDelete,
  };
};

/**
 * Master Item State Hook
 * @returns {BaseItemState} - Master item state and handlers
 */
export const useMasterItemState = (): BaseItemState => {
  const modalState = useModalState();
  const confirmModalState = useConfirmModalState();

  return {
    ...modalState,
    ...confirmModalState,
  };
};
