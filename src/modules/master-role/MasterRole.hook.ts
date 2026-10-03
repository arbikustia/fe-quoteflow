import { useState } from "react";
import type { BaseRoleState, RoleData, ConfirmModalState, ModalState } from "./MasterRole.type";

const useModalState = (): ModalState => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);
  const openCreateModal = (): void => { setEditingRole(null); setIsModalOpen(true); };
  const openEditModal = (data: RoleData): void => { setEditingRole(data); setIsModalOpen(true); };
  const closeModal = (): void => { setIsModalOpen(false); setTimeout(() => setEditingRole(null), 200); };
  return { isModalOpen, editingRole, openCreateModal, openEditModal, closeModal };
};

const useConfirmModalState = (): ConfirmModalState => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingRole, setDeletingRole] = useState<RoleData | null>(null);
  const openConfirmModal = (data: RoleData): void => { setDeletingRole(data); setIsConfirmModalOpen(true); };
  const closeConfirmModal = (): void => { setIsConfirmModalOpen(false); setTimeout(() => setDeletingRole(null), 200); };
  const onConfirmDelete = (): void => { closeConfirmModal(); };
  return { isConfirmModalOpen, deletingRole, openConfirmModal, closeConfirmModal, onConfirmDelete };
};

/**
 * Master Role State Hook
 * @returns {BaseRoleState} state
 */
export const useMasterRoleState = (): BaseRoleState => {
  return { ...useModalState(), ...useConfirmModalState() };
};
