import { useState } from "react";

import type { BaseCategoryState, CategoryData, ConfirmModalState, ModalState } from "./DesktopMasterCategory.type";

/**
 * Modal state hook
 * @returns {ModalState} modal state
 */
const useModalState = (): ModalState => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(
    null,
  );

  /**
   * Open create modal
   * @returns {void} void
   */
  const openCreateModal = (): void => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  /**
   * Open edit modal
   * @param {CategoryData} category - category data
   * @returns {void} void
   */
  const openEditModal = (category: CategoryData): void => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  /**
   * Close modal
   * @returns {void} void
   */
  const closeModal = (): void => {
    setIsModalOpen(false);
    setTimeout((): void => setEditingCategory(null), 200);
  };

  return {
    isModalOpen,
    editingCategory,
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
  const [deletingCategory, setDeletingCategory] = useState<CategoryData | null>(
    null,
  );

  /**
   * Open confirm modal
   * @param {CategoryData} category - category data
   * @returns {void} void
   */
  const openConfirmModal = (category: CategoryData): void => {
    setDeletingCategory(category);
    setIsConfirmModalOpen(true);
  };

  /**
   * Close confirm modal
   * @returns {void} void
   */
  const closeConfirmModal = (): void => {
    setIsConfirmModalOpen(false);
    setTimeout((): void => setDeletingCategory(null), 200);
  };

  /**
   * On confirm delete
   * @returns {void} void
   */
  const onConfirmDelete = (): void => {
    closeConfirmModal();
  };

  return {
    isConfirmModalOpen,
    deletingCategory,
    openConfirmModal,
    closeConfirmModal,
    onConfirmDelete,
  };
};

/**
 * Master Category State Hook
 * @returns {BaseCategoryState} - Master category state and handlers
 */
export const useDesktopMasterCategoryState = (): BaseCategoryState => {
  const modalState = useModalState();
  const confirmModalState = useConfirmModalState();

  return {
    ...modalState,
    ...confirmModalState,
  };
};
