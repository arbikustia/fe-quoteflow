/* eslint-disable jsdoc/require-jsdoc */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MOCK_PICS } from "@/fixture/master-pic";

import type { PicData } from "../MasterPic.type";

import type { MasterPicDetailMenuState, MasterPicDetailState } from "./MasterPicDetail.type";

const useDetailMenuState = (): MasterPicDetailMenuState => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const toggleMore = (): void => { setIsMoreOpen((prev) => !prev); };
  const closeMore = (): void => { setIsMoreOpen(false); };
  const openDeleteModal = (): void => { closeMore(); setIsDeleteModalOpen(true); };
  const closeDeleteModal = (): void => { setIsDeleteModalOpen(false); };

  return { isMoreOpen, isDeleteModalOpen, toggleMore, closeMore, openDeleteModal, closeDeleteModal };
};

/**
 * Manage PIC detail state.
 * @returns {MasterPicDetailState} Detail state
 */
export const useMasterPicDetail = (): MasterPicDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ readonly id: string }>();
  const menuState = useDetailMenuState();
  const pic: PicData | null = MOCK_PICS.find((item) => item.id === id) ?? null;
  const goBack = (): void => { navigate(-1); };
  const goEdit = (): void => { menuState.closeMore();

 if (pic) navigate(`/master-pic/edit/${pic.id}`); };
  const handleDelete = (): void => { menuState.closeDeleteModal(); navigate("/master-pic"); };

  return { pic, goBack, goEdit, handleDelete, ...menuState };
};
