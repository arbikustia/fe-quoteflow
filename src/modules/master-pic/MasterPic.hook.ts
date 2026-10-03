import { useState } from "react";
import type { BasePicState, PicData, ConfirmModalState, ModalState } from "./MasterPic.type";

const useModalState = (): ModalState => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPic, setEditingPic] = useState<PicData | null>(null);
  const openCreateModal = (): void => { setEditingPic(null); setIsModalOpen(true); };
  const openEditModal = (data: PicData): void => { setEditingPic(data); setIsModalOpen(true); };
  const closeModal = (): void => { setIsModalOpen(false); setTimeout(() => setEditingPic(null), 200); };
  return { isModalOpen, editingPic, openCreateModal, openEditModal, closeModal };
};

const useConfirmModalState = (): ConfirmModalState => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingPic, setDeletingPic] = useState<PicData | null>(null);
  const openConfirmModal = (data: PicData): void => { setDeletingPic(data); setIsConfirmModalOpen(true); };
  const closeConfirmModal = (): void => { setIsConfirmModalOpen(false); setTimeout(() => setDeletingPic(null), 200); };
  const onConfirmDelete = (): void => { closeConfirmModal(); };
  return { isConfirmModalOpen, deletingPic, openConfirmModal, closeConfirmModal, onConfirmDelete };
};

/**
 * Master PIC State Hook
 * @returns {BasePicState} state
 */
export const useMasterPicState = (): BasePicState => {
  return { ...useModalState(), ...useConfirmModalState() };
};
