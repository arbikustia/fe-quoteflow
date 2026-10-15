import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MOCK_CATEGORIES } from "@/fixture/master-category";

import type { MasterCategoryDetailMenuState, MasterCategoryDetailState } from "./MasterCategoryDetail.type";
import type { CategoryData } from "../MasterCategory.type";

/**
 * Resolve a category from the current route ID.
 * @param {string | undefined} id - Route category ID
 * @returns {CategoryData | null} Matching category or null
 */
const _getCategory = (id: string | undefined): CategoryData | null => (
  MOCK_CATEGORIES.find((category) => category.id === id) ?? null
);

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
  const category = _getCategory(id);
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
