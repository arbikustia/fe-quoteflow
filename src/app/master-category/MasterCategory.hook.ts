import { useState } from 'react';
import type { CategoryData } from './MasterCategory.type';

export const useMasterCategoryState = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryData | null>(null);

  const openCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category: CategoryData) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingCategory(null), 200);
  };

  const openConfirmModal = (category: CategoryData) => {
    setDeletingCategory(category);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setTimeout(() => setDeletingCategory(null), 200);
  };

  const onConfirmDelete = () => {
    console.log("Delete category:", deletingCategory?.categoryName);
  };

  return {
    isModalOpen,
    isConfirmModalOpen,
    editingCategory,
    deletingCategory,
    openCreateModal,
    openEditModal,
    closeModal,
    openConfirmModal,
    closeConfirmModal,
    onConfirmDelete,
  };
};
