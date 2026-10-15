/* eslint-disable jsdoc/require-returns */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MOCK_USERS } from "@/fixture/master-user";

import type { UserData } from "../MasterUser.type";

import type { MasterUserDetailMenuState, MasterUserDetailState } from "./MasterUserDetail.type";

/**
 *
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

/** Manage master user detail state. */
export const useMasterUserDetail = (): MasterUserDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ readonly id: string }>();
  const menuState = useDetailMenuState();
  const user: UserData | null = MOCK_USERS.find((item) => item.id === id) ?? null;
  /**
   *
   */
  const goBack = (): void => { navigate(-1); };
  /**
   *
   */
  const goEdit = (): void => { menuState.closeMore();

 if (user) navigate(`/master-user/edit/${user.id}`); };
  /**
   *
   */
  const handleDelete = (): void => { menuState.closeDeleteModal(); navigate("/master-user"); };

  return { user, goBack, goEdit, handleDelete, ...menuState };
};
