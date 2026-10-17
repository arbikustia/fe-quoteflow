import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { RoleData, RoleDetailResponse } from "../MasterRole.type";

import type { MasterRoleDetailMenuState, MasterRoleDetailState } from "./MasterRoleDetail.type";

import { mapRole, useGetRoleByIdQuery } from "@/services/master-role.service";

/**
 * Manage role detail menu state.
 * @returns {MasterRoleDetailMenuState} Menu state and handlers
 */
const useDetailMenuState = (): MasterRoleDetailMenuState => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  /**
   *
   */
  const toggleMore = (): void => { setIsMoreOpen((previous) => !previous); };
  /**
   *
   */
  const closeMore = (): void => { setIsMoreOpen(false); };
  /**
   *
   */
  const openDeleteModal = (): void => { closeMore(); setIsDeleteModalOpen(true); };
  /**
   *
   */
  const closeDeleteModal = (): void => { setIsDeleteModalOpen(false); };

  return { isMoreOpen, isDeleteModalOpen, toggleMore, closeMore, openDeleteModal, closeDeleteModal };
};

/**
 * Resolve role detail response.
 * @param {RoleDetailResponse | undefined} response - API response
 * @returns {RoleData | null} Role or null
 */
const _resolveRole = (response: RoleDetailResponse | undefined): RoleData | null => {
  if (!response?.status || !response.data) {
    return null;
  }

  const item = Array.isArray(response.data) ? response.data[0] : response.data;

  return item ? mapRole(item) : null;
};

/**
 * Manage role detail state.
 * @returns {MasterRoleDetailState} Detail state
 */
export const useMasterRoleDetail = (): MasterRoleDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ readonly id: string }>();
  const menuState = useDetailMenuState();
  const { data: response } = useGetRoleByIdQuery(id ?? "", { skip: !id });
  const role = _resolveRole(response);

  /**
   *
   */
  const goBack = (): void => { navigate(-1); };
  /**
   *
   */
  const goEdit = (): void => {
    menuState.closeMore();

    if (role) {
      navigate(`/master-role/edit/${role.id}`, { state: { role } });
    }
  };
  /**
   *
   */
  const handleDelete = (): void => { menuState.closeDeleteModal(); navigate("/master-role"); };

  return { role, goBack, goEdit, handleDelete, ...menuState };
};
