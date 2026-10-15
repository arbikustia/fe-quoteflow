/* eslint-disable jsdoc/require-param-type, jsdoc/require-param-description, jsdoc/require-returns */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MOCK_ITEMS } from "@/fixture/master-item";

import type { ItemData } from "../MasterItem.type";

import type { MasterItemDetailState } from "./MasterItemDetail.type";

/**
 * Resolve item from route ID. @param {string | undefined} id - Route ID @returns {ItemData | null} Item
 * @param id
 */
const _getItem = (id: string | undefined): ItemData | null => MOCK_ITEMS.find((item) => item.id === id) ?? null;

/** Manage item detail state and actions. @returns {MasterItemDetailState} Detail state */
export const useMasterItemDetail = (): MasterItemDetailState => {
  const navigate = useNavigate();
  const { id } = useParams<{ readonly id: string }>();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const item = _getItem(id);
  /**
   *
   */
  const goBack = (): void => { navigate(-1); };
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
  const goEdit = (): void => {
    closeMore();

    if (item) {
      navigate(`/master-item/edit/${item.id}`);
    }
  };
  /**
   *
   */
  const openDeleteModal = (): void => {
    closeMore();
    setIsDeleteModalOpen(true);
  };
  /**
   *
   */
  const closeDeleteModal = (): void => { setIsDeleteModalOpen(false); };
  /**
   *
   */
  const handleDelete = (): void => {
    closeDeleteModal();
    navigate("/master-item");
  };

  return { item, isMoreOpen, isDeleteModalOpen, goBack, toggleMore, closeMore, goEdit, openDeleteModal, closeDeleteModal, handleDelete };
};
