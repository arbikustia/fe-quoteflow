import { useState } from 'react';
import type { UserData, MasterUserProps } from './MasterUser.type';

/**
 * Master User State Hook
 * @returns {MasterUserProps} - Master user state and handlers
 */
export const useMasterUserState = (): MasterUserProps => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserData | null>(null);

  const openCreateModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserData) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingUser(null), 200);
  };

  const openConfirmModal = (user: UserData) => {
    setDeletingUser(user);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setTimeout(() => setDeletingUser(null), 200);
  };

  const onConfirmDelete = () => {
    console.log("Delete user:", deletingUser?.username);
  };

  return {
    isModalOpen,
    isConfirmModalOpen,
    editingUser,
    deletingUser,
    openCreateModal,
    openEditModal,
    closeModal,
    openConfirmModal,
    closeConfirmModal,
    onConfirmDelete,
  };
};
