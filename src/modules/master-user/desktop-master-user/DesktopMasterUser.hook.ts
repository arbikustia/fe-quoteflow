import { useState } from "react";

import type { BaseUserState, ConfirmModalState, ModalState, UserData } from "./DesktopMasterUser.type";

/**
 * Modal state hook
 * @returns {ModalState} modal state
 */
const useModalState = (): ModalState => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);

  /**
   * Open create modal
   * @returns {void} void
   */
  const openCreateModal = (): void => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  /**
   * Open edit modal
   * @param {UserData} user - user data
   * @returns {void} void
   */
  const openEditModal = (user: UserData): void => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  /**
   * Close modal
   * @returns {void} void
   */
  const closeModal = (): void => {
    setIsModalOpen(false);
    setTimeout((): void => setEditingUser(null), 200);
  };

  return {
    isModalOpen,
    editingUser,
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
  const [deletingUser, setDeletingUser] = useState<UserData | null>(null);

  /**
   * Open confirm modal
   * @param {UserData} user - user data
   * @returns {void} void
   */
  const openConfirmModal = (user: UserData): void => {
    setDeletingUser(user);
    setIsConfirmModalOpen(true);
  };

  /**
   * Close confirm modal
   * @returns {void} void
   */
  const closeConfirmModal = (): void => {
    setIsConfirmModalOpen(false);
    setTimeout((): void => setDeletingUser(null), 200);
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
    deletingUser,
    openConfirmModal,
    closeConfirmModal,
    onConfirmDelete,
  };
};

/**
 * Master User State Hook
 * @returns {BaseUserState} - Master user state and handlers
 */
export const useDesktopMasterUserState = (): BaseUserState => {
  const modalState = useModalState();
  const confirmModalState = useConfirmModalState();

  return {
    ...modalState,
    ...confirmModalState,
  };
};
