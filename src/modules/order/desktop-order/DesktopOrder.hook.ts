import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { BaseDesktopOrderState, QuoteData } from "./DesktopOrder.type";

/**
 * Hook for managing view modals state
 * @returns {object} view modals state
 */
const useViewModalState = (): Pick<
  BaseDesktopOrderState,
  | "viewingItemsQuote"
  | "viewingCategoriesQuote"
  | "openViewItemsModal"
  | "closeViewItemsModal"
  | "openViewCategoriesModal"
  | "closeViewCategoriesModal"
> => {
  const [viewingItemsQuote, setViewingItemsQuote] = useState<QuoteData | null>(
    null,
  );
  const [viewingCategoriesQuote, setViewingCategoriesQuote] =
    useState<QuoteData | null>(null);

  /**
   * Handle open view items modal
   * @param {QuoteData} quote - current quote
   * @returns {void} void
   */
  const openViewItemsModal = (quote: QuoteData): void => {
    setViewingItemsQuote(quote);
  };

  /**
   * Handle close view items modal
   * @returns {void} void
   */
  const closeViewItemsModal = (): void => {
    setViewingItemsQuote(null);
  };

  /**
   * Handle open view categories modal
   * @param {QuoteData} quote - current quote
   * @returns {void} void
   */
  const openViewCategoriesModal = (quote: QuoteData): void => {
    setViewingCategoriesQuote(quote);
  };

  /**
   * Handle close view categories modal
   * @returns {void} void
   */
  const closeViewCategoriesModal = (): void => {
    setViewingCategoriesQuote(null);
  };

  return {
    viewingItemsQuote,
    viewingCategoriesQuote,
    openViewItemsModal,
    closeViewItemsModal,
    openViewCategoriesModal,
    closeViewCategoriesModal,
  };
};

/**
 * Hook for managing confirm modal state
 * @returns {object} confirm modal state
 */
const useConfirmModalState = (): Pick<
  BaseDesktopOrderState,
  | "isConfirmModalOpen"
  | "deletingQuote"
  | "openConfirmModal"
  | "closeConfirmModal"
  | "onConfirmDelete"
> => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingQuote, setDeletingQuote] = useState<QuoteData | null>(null);

  /**
   * Handle open confirm modal
   * @param {QuoteData} quote - current quote
   * @returns {void} void
   */
  const openConfirmModal = (quote: QuoteData): void => {
    setDeletingQuote(quote);
    setIsConfirmModalOpen(true);
  };

  /**
   * Handle close confirm modal
   * @returns {void} void
   */
  const closeConfirmModal = (): void => {
    setIsConfirmModalOpen(false);
    setTimeout(() => setDeletingQuote(null), 200);
  };

  /**
   * Handle confirm delete
   * @returns {void} void
   */
  const onConfirmDelete = (): void => {
    // API logic to delete will go here
  };

  return {
    isConfirmModalOpen,
    deletingQuote,
    openConfirmModal,
    closeConfirmModal,
    onConfirmDelete,
  };
};

/**
 * Order Page State Hook
 * @returns {BaseDesktopOrderState} - Order page state and handlers
 */
export const useDesktopOrderState = (): BaseDesktopOrderState => {
  const navigate = useNavigate();
  const viewState = useViewModalState();
  const confirmState = useConfirmModalState();

  /**
   * Handle open create modal
   * @returns {void} void
   */
  const openCreateModal = (): void => {
    navigate("/order/create");
  };

  /**
   * Handle open edit modal
   * @param {QuoteData} quote - current quote
   * @returns {void} void
   */
  const openEditModal = (quote: QuoteData): void => {
    navigate(`/order/edit/${quote.id}`);
  };

  return {
    ...viewState,
    ...confirmState,
    openCreateModal,
    openEditModal,
  };
};
