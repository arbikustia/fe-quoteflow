import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { mapCategory, useGetCategoryByIdQuery } from "@/services/master-category.service";

import type { MasterCategoryDetailMenuState, MasterCategoryDetailState } from "./MasterCategoryDetail.type";
import type { CategoryData, CategoryDetailResponse } from "../MasterCategory.type";

/**
 * Resolve category API response to UI category data.
 * @param {CategoryDetailResponse | undefined} response - Category API response
 * @returns {CategoryData | null} Category data or null
 */
const _getCategory = (response: CategoryDetailResponse | undefined): CategoryData | null => {
  if (!response?.status || !response.data) {
    return null;
  }

  return mapCategory(response.data);
};

/**
 * Hook to manage detail action menu state.
 * @returns {MasterCategoryDetailMenuState} Menu state and handlers
 */
const useDetailMenuState = (): MasterCategoryDetailMenuState => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const toggleMore = (): void => { setIsMoreOpen((previous) => !previous); };
  const closeMore = (): void => { setIsMoreOpen(false); };
  const openDeleteModal = (): void => {
    setIsMoreOpen(false);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = (): void => { setIsDeleteModalOpen(false); };

  return { isMoreOpen, isDeleteModalOpen, toggleMore, closeMore, openDeleteModal, closeDeleteModal };
};

/**
 * Hook to manage Master Category Detail state and actions.
 * @returns {MasterCategoryDetailState} Detail state and handlers
 */
export const useMasterCategoryDetail = (): MasterCategoryDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ readonly id: string }>();
  const { data: categoryResponse } = useGetCategoryByIdQuery(id ?? "", { skip: !id });
  const category = _getCategory(categoryResponse);
  const menuState = useDetailMenuState();
  const { closeMore, closeDeleteModal } = menuState;

  const goBack = (): void => { navigate(-1); };
  const goEdit = (): void => {
    closeMore();

    if (category) {
      navigate(`/master-category/edit/${category.id}`);
    }
  };
  const handleDelete = (): void => {
    closeDeleteModal();
    navigate("/master-category");
  };

  return { category, goBack, goEdit, handleDelete, ...menuState };
};
