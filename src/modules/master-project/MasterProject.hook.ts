import { useState } from "react";
import type { BaseProjectState, ConfirmModalState, ModalState, ProjectData } from "./MasterProject.type";

const useModalState = (): ModalState => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectData | null>(null);

  const openCreateModal = (): void => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: ProjectData): void => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setTimeout((): void => setEditingProject(null), 200);
  };

  return { isModalOpen, editingProject, openCreateModal, openEditModal, closeModal };
};

const useConfirmModalState = (): ConfirmModalState => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState<ProjectData | null>(null);

  const openConfirmModal = (project: ProjectData): void => {
    setDeletingProject(project);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = (): void => {
    setIsConfirmModalOpen(false);
    setTimeout((): void => setDeletingProject(null), 200);
  };

  const onConfirmDelete = (): void => {
    closeConfirmModal();
  };

  return { isConfirmModalOpen, deletingProject, openConfirmModal, closeConfirmModal, onConfirmDelete };
};

export const useMasterProjectState = (): BaseProjectState => {
  const modalState = useModalState();
  const confirmModalState = useConfirmModalState();
  return { ...modalState, ...confirmModalState };
};
