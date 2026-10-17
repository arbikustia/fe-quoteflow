import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { ItemData } from "../MasterItem.type";

import type { MasterItemDetailMenuState, MasterItemDetailState } from "./MasterItemDetail.type";

import { mapItem, useGetItemByIdQuery } from "@/services/master-item.service";

/**
 * Manage item detail menu and modal state.
 * @returns {MasterItemDetailMenuState} Menu state and handlers
 */
const useDetailMenuState = (): MasterItemDetailMenuState => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  /** Toggle more menu. @returns {void} No return value */
  const toggleMore = (): void => { setIsMoreOpen((previous) => !previous); };
  /** Close more menu. @returns {void} No return value */
  const closeMore = (): void => { setIsMoreOpen(false); };
  /** Open delete confirmation. @returns {void} No return value */
  const openDeleteModal = (): void => { closeMore(); setIsDeleteModalOpen(true); };
  /** Close delete confirmation. @returns {void} No return value */
  const closeDeleteModal = (): void => { setIsDeleteModalOpen(false); };

  return { isMoreOpen, isDeleteModalOpen, toggleMore, closeMore, openDeleteModal, closeDeleteModal };
};

/**
 * Resolve API response item.
 * @param {Parameters<typeof mapItem>[0] | null | undefined} item - API item
 * @returns {ItemData | null} Item data or null
 */
const _getItem = (item: Parameters<typeof mapItem>[0] | null | undefined): ItemData | null => (item ? mapItem(item) : null);

/**
 * Manage item detail state and actions.
 * @returns {MasterItemDetailState} Detail state
 */
export const useMasterItemDetail = (): MasterItemDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const menuState = useDetailMenuState();
  const { data: itemResponse } = useGetItemByIdQuery(id ?? "", { skip: !id });
  const item = _getItem(itemResponse?.data);

  /** Navigate back. @returns {void} No return value */
  const goBack = (): void => { navigate(-1); };
  /** Navigate to edit page. @returns {void} No return value */
  const goEdit = (): void => {
    menuState.closeMore();

    if (item) {
      navigate(`/master-item/edit/${item.id}`);
    }
  };
  /** Complete delete flow. @returns {void} No return value */
  const handleDelete = (): void => {
    menuState.closeDeleteModal();
    navigate("/master-item");
  };

  return { item, goBack, goEdit, handleDelete, ...menuState };
};
