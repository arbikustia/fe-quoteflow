import { useState } from "react";

import type {
  BaseCategoryState,
  CategoryData,
  ConfirmModalState,
  ModalState,
} from "./MasterCategory.type";

const useModalState = (): ModalState => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(
    null,
  );
  const openCreateModal = (): void => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };
  const openEditModal = (data: CategoryData): void => {
    setEditingCategory(data);
    setIsModalOpen(true);
  };
  const closeModal = (): void => {
    setIsModalOpen(false);
    setTimeout(() => setEditingCategory(null), 200);
  };
  return {
    isModalOpen,
    editingCategory,
    openCreateModal,
    openEditModal,
    closeModal,
  };
};

const useConfirmModalState = (): ConfirmModalState => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<CategoryData | null>(
    null,
  );
  const openConfirmModal = (data: CategoryData): void => {
    setDeletingCategory(data);
    setIsConfirmModalOpen(true);
  };
  const closeConfirmModal = (): void => {
    setIsConfirmModalOpen(false);
    setTimeout(() => setDeletingCategory(null), 200);
  };
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
 * @returns {BaseCategoryState} state
 */
export const useMasterCategoryState = (): BaseCategoryState => {
  return { ...useModalState(), ...useConfirmModalState() };
};
