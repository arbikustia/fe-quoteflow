export type CategoryData = {
  id: string;
  categoryName: string;
};

export type MasterCategoryProps = {
  isModalOpen: boolean;
  isConfirmModalOpen: boolean;
  editingCategory: CategoryData | null;
  deletingCategory: CategoryData | null;
  openCreateModal: () => void;
  openEditModal: (category: CategoryData) => void;
  closeModal: () => void;
  openConfirmModal: (category: CategoryData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
};
