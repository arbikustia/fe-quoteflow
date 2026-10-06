/**
 * @file MasterItem.hook.ts
 * @description Hook managing state for Master Item.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MOCK_ITEMS } from "../../fixture/master-item";
import { usePagination } from "../../hooks/usePagination";

import type {
  BaseItemState,
  ConfirmModalState,
  ItemData,
  MasterItemContainerState,
  MasterItemNavigation,
  ModalState,
} from "./MasterItem.type";

/**
 * Modal state hook
 * @returns {ModalState} Modal state
 */
const useModalState = (): ModalState => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemData | null>(null);

  /**
   * Open create modal
   * @returns {void} void
   */
  const openCreateModal = (): void => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  /**
   * Open edit modal
   * @param {ItemData} item - item data
   * @returns {void} void
   */
  const openEditModal = (item: ItemData): void => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  /**
   * Close modal
   * @returns {void} void
   */
  const closeModal = (): void => {
    setIsModalOpen(false);
    setTimeout((): void => setEditingItem(null), 200);
  };

  return {
    isModalOpen,
    editingItem,
    openCreateModal,
    openEditModal,
    closeModal,
  };
};

/**
 * Confirm modal state hook
 * @returns {ConfirmModalState} Confirm modal state
 */
const useConfirmModalState = (): ConfirmModalState => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<ItemData | null>(null);

  /**
   * Open confirm modal
   * @param {ItemData} item - item data
   * @returns {void} void
   */
  const openConfirmModal = (item: ItemData): void => {
    setDeletingItem(item);
    setIsConfirmModalOpen(true);
  };

  /**
   * Close confirm modal
   * @returns {void} void
   */
  const closeConfirmModal = (): void => {
    setIsConfirmModalOpen(false);
    setTimeout((): void => setDeletingItem(null), 200);
  };

  /**
   * Handle confirm delete
   * @returns {void} void
   */
  const onConfirmDelete = (): void => {
    closeConfirmModal();
  };

  return {
    isConfirmModalOpen,
    deletingItem,
    openConfirmModal,
    closeConfirmModal,
    onConfirmDelete,
  };
};

/**
 * Main Master Item state hook
 * @returns {BaseItemState} base state
 */
export const useMasterItemState = (): BaseItemState => {
  const modalState = useModalState();
  const confirmModalState = useConfirmModalState();

  return { ...modalState, ...confirmModalState };
};

/**
 * Navigation hook
 * @returns {MasterItemNavigation} navigation state
 */
export const useMasterItemNavigation = (): MasterItemNavigation => {
  const navigate = useNavigate();

  /**
   * Navigate back
   * @returns {void} void
   */
  const goBack = (): void => {
    navigate(-1);
  };

  /**
   * Navigate to create
   * @returns {void} void
   */
  const goCreate = (): void => {
    navigate("/master-item/create");
  };

  /**
   * Navigate to edit
   * @param {ItemData} item - item data
   * @returns {void} void
   */
  const goEdit = (item: ItemData): void => {
    navigate(`/master-item/edit/${item.id}`);
  };

  /**
   * Navigate to detail
   * @param {ItemData} item - item data
   * @returns {void} void
   */
  const goDetail = (item: ItemData): void => {
    navigate(`/master-item/detail/${item.id}`);
  };

  return { goBack, goCreate, goEdit, goDetail };
};

/**
 * Container state hook
 * @returns {MasterItemContainerState} container state
 */
export const useMasterItemContainerState = (): MasterItemContainerState => {
  const navigation = useMasterItemNavigation();
  const pagination = usePagination(MOCK_ITEMS);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  /**
   * Toggle more
   * @returns {void} void
   */
  const toggleMore = (): void => {
    setIsMoreOpen(!isMoreOpen);
  };

  /**
   * Handle delete
   * @returns {void} void
   */
  const goDelete = (): void => {
    setIsMoreOpen(false);
  };

  /**
   * Close more menu
   * @returns {void} void
   */
  const handleCloseMore = (): void => {
    setIsMoreOpen(false);
  };

  /**
   * Handle confirm
   * @returns {void} void
   */
  const handleConfirm = (): void => {};

  return {
    ...navigation,
    pagination,
    isMoreOpen,
    toggleMore,
    goDelete,
    handleCloseMore,
    handleConfirm,
  };
};
