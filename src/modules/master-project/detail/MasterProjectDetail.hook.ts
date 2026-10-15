/* eslint-disable jsdoc/require-jsdoc */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MOCK_PROJECTS } from "@/fixture/master-project";

import type { ProjectData } from "../MasterProject.type";

import type { MasterProjectDetailMenuState, MasterProjectDetailState } from "./MasterProjectDetail.type";

const useDetailMenuState = (): MasterProjectDetailMenuState => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const toggleMore = (): void => { setIsMoreOpen((previous) => !previous); };
  const closeMore = (): void => { setIsMoreOpen(false); };
  const openDeleteModal = (): void => { closeMore(); setIsDeleteModalOpen(true); };
  const closeDeleteModal = (): void => { setIsDeleteModalOpen(false); };

  return { isMoreOpen, isDeleteModalOpen, toggleMore, closeMore, openDeleteModal, closeDeleteModal };
};

/**
 * Manage project detail state.
 * @returns {MasterProjectDetailState} Detail state
 */
export const useMasterProjectDetail = (): MasterProjectDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ readonly id: string }>();
  const menuState = useDetailMenuState();
  const project: ProjectData | null = MOCK_PROJECTS.find((item) => item.id === id) ?? null;
  const goBack = (): void => { navigate(-1); };
  const goEdit = (): void => { menuState.closeMore();

 if (project) navigate(`/master-project/edit/${project.id}`); };
  const handleDelete = (): void => { menuState.closeDeleteModal(); navigate("/master-project"); };

  return { project, goBack, goEdit, handleDelete, ...menuState };
};
