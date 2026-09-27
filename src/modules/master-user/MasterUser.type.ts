export type UserData = {
  id: string;
  username: string;
  role: string;
};

export type MasterUserProps = {
  isModalOpen: boolean;
  isConfirmModalOpen: boolean;
  editingUser: UserData | null;
  deletingUser: UserData | null;
  openCreateModal: () => void;
  openEditModal: (user: UserData) => void;
  closeModal: () => void;
  openConfirmModal: (user: UserData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
};
