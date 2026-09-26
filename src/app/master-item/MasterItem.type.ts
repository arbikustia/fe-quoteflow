export type ItemData = {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  remark: string;
};

export type MasterItemProps = {
  isModalOpen: boolean;
  isConfirmModalOpen: boolean;
  editingItem: ItemData | null;
  deletingItem: ItemData | null;
  openCreateModal: () => void;
  openEditModal: (item: ItemData) => void;
  closeModal: () => void;
  openConfirmModal: (item: ItemData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
};
