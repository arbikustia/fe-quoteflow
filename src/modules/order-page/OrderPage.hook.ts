import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { BaseOrderPageState, QuoteData } from "./OrderPage.type";

/**
 * Hook for managing view modals state
 * @returns {object} view modals state
 */
const useViewModalState = (): Pick<
  BaseOrderPageState,
  "viewingItemsQuote" | "viewingCategoriesQuote" | "openViewItemsModal" | "closeViewItemsModal" | "openViewCategoriesModal" | "closeViewCategoriesModal"
> => {
  const [viewingItemsQuote, setViewingItemsQuote] = useState<QuoteData | null>(null);
  const [viewingCategoriesQuote, setViewingCategoriesQuote] = useState<QuoteData | null>(null);

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
  BaseOrderPageState,
  "isConfirmModalOpen" | "deletingQuote" | "openConfirmModal" | "closeConfirmModal" | "onConfirmDelete"
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
    // eslint-disable-next-line no-console
    console.log("Delete quote:", deletingQuote?.name);
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
 * @returns {BaseOrderPageState} - Order page state and handlers
 */
export const useOrderPageState = (): BaseOrderPageState => {
  const navigate = useNavigate();
  const viewState = useViewModalState();
  const confirmState = useConfirmModalState();

  /**
   * Handle open create modal
   * @returns {void} void
   */
  const openCreateModal = (): void => {
    navigate("/quotes/create");
  };

  /**
   * Handle open edit modal
   * @param {QuoteData} quote - current quote
   * @returns {void} void
   */
  const openEditModal = (quote: QuoteData): void => {
    navigate(`/quotes/edit/${quote.id}`);
  };

  return {
    ...viewState,
    ...confirmState,
    openCreateModal,
    openEditModal,
  };
};
