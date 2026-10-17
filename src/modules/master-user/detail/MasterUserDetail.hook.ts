import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { UserData, UserDetailResponse } from "../MasterUser.type";

import type { MasterUserDetailMenuState, MasterUserDetailState } from "./MasterUserDetail.type";

import { mapUser, useGetUserByIdQuery } from "@/services/master-user.service";

/**
 * Manage master user detail menu state.
 * @returns {MasterUserDetailMenuState} Menu state and handlers
 */
const useDetailMenuState = (): MasterUserDetailMenuState => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  /**
   *
   */
  const toggleMore = (): void => { setIsMoreOpen((prev) => !prev); };
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
 * Resolve user detail from query response.
 * @param {UserDetailResponse | undefined} response - API response
 * @returns {UserData | null} User or null
 */
const _resolveUser = (response: UserDetailResponse | undefined): UserData | null => {
  if (!response?.status || !response.data) {
    return null;
  }

  const item = Array.isArray(response.data) ? response.data[0] : response.data;

  return item ? mapUser(item) : null;
};

/**
 * Manage master user detail state.
 * @returns {MasterUserDetailState} Detail state
 */
export const useMasterUserDetail = (): MasterUserDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ readonly id: string }>();
  const menuState = useDetailMenuState();
  const { data: response } = useGetUserByIdQuery(id ?? "", { skip: !id });
  const user = _resolveUser(response);

  /**
   *
   */
  const goBack = (): void => { navigate(-1); };
  /**
   *
   */
  const goEdit = (): void => {
    menuState.closeMore();

    if (user) {
      navigate(`/master-user/edit/${user.id}`, { state: { user } });
    }
  };
  /**
   *
   */
  const handleDelete = (): void => { menuState.closeDeleteModal(); navigate("/master-user"); };

  return { user, goBack, goEdit, handleDelete, ...menuState };
};
