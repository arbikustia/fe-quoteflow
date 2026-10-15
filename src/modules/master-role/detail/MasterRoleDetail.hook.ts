/* eslint-disable jsdoc/require-jsdoc */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MOCK_ROLES } from "@/fixture/master-role";

import type { RoleData } from "../MasterRole.type";

import type { MasterRoleDetailMenuState, MasterRoleDetailState } from "./MasterRoleDetail.type";

const useDetailMenuState = (): MasterRoleDetailMenuState => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const toggleMore = (): void => { setIsMoreOpen((previous) => !previous); };
  const closeMore = (): void => { setIsMoreOpen(false); };
  const openDeleteModal = (): void => { closeMore(); setIsDeleteModalOpen(true); };
  const closeDeleteModal = (): void => { setIsDeleteModalOpen(false); };

  return { isMoreOpen, isDeleteModalOpen, toggleMore, closeMore, openDeleteModal, closeDeleteModal };
};

/**
 * Manage role detail state.
 * @returns {MasterRoleDetailState} Detail state
 */
export const useMasterRoleDetail = (): MasterRoleDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ readonly id: string }>();
  const menuState = useDetailMenuState();
  const role: RoleData | null = MOCK_ROLES.find((item) => item.id === id) ?? null;
  const goBack = (): void => { navigate(-1); };
  const goEdit = (): void => { menuState.closeMore();

 if (role) navigate(`/master-role/edit/${role.id}`); };
  const handleDelete = (): void => { menuState.closeDeleteModal(); navigate("/master-role"); };

  return { role, goBack, goEdit, handleDelete, ...menuState };
};
