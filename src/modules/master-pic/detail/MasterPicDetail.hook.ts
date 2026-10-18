import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { PicData, PicDetailResponse } from "../MasterPic.type";

import type { MasterPicDetailMenuState, MasterPicDetailState } from "./MasterPicDetail.type";

import { mapPic, useGetPicByIdQuery } from "@/services/master-pic.service";

/**
 * Manage PIC detail menu state.
 * @returns {MasterPicDetailMenuState} Menu state and handlers
 */
const useDetailMenuState = (): MasterPicDetailMenuState => {
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
 * Resolve PIC detail response.
 * @param {PicDetailResponse | undefined} response - API response
 * @returns {PicData | null} PIC or null
 */
const _resolvePic = (response: PicDetailResponse | undefined): PicData | null => {
  if (!response?.status || !response.data) {
    return null;
  }

  const item = Array.isArray(response.data) ? response.data[0] : response.data;

  return item ? mapPic(item) : null;
};

/**
 * Manage PIC detail state.
 * @returns {MasterPicDetailState} Detail state
 */
export const useMasterPicDetail = (): MasterPicDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const menuState = useDetailMenuState();
  const { data: response } = useGetPicByIdQuery(id ?? "", { skip: !id });
  const pic = _resolvePic(response);

  /**
   *
   */
  const goBack = (): void => { navigate(-1); };
  /**
   *
   */
  const goEdit = (): void => {
    menuState.closeMore();

    if (pic) {
      navigate(`/master-pic/edit/${pic.id}`, { state: { pic } });
    }
  };
  /**
   *
   */
  const handleDelete = (): void => { menuState.closeDeleteModal(); navigate("/master-pic"); };

  return { pic, goBack, goEdit, handleDelete, ...menuState };
};
