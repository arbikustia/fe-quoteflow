import { useState } from "react";
import type { BaseUserState, UserData, ConfirmModalState, ModalState } from "./MasterUser.type";

const useModalState = (): ModalState => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  const openCreateModal = (): void => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserData): void => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setTimeout((): void => setEditingUser(null), 200);
  };

  return { isModalOpen, editingUser, openCreateModal, openEditModal, closeModal };
};

const useConfirmModalState = (): ConfirmModalState => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<UserData | null>(null);

  const openConfirmModal = (user: UserData): void => {
    setDeletingUser(user);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = (): void => {
    setIsConfirmModalOpen(false);
    setTimeout((): void => setDeletingUser(null), 200);
  };

  const onConfirmDelete = (): void => {
    closeConfirmModal();
  };

  return { isConfirmModalOpen, deletingUser, openConfirmModal, closeConfirmModal, onConfirmDelete };
};

export const useMasterUserState = (): BaseUserState => {
  const modalState = useModalState();
  const confirmModalState = useConfirmModalState();
  return { ...modalState, ...confirmModalState };
};
