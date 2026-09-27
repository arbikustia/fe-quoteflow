import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { QuoteData, OrderPageProps } from "./OrderPage.type";

/**
 * Order Page State Hook
 * @returns {OrderPageProps} - Order page state and handlers
 */
export const useOrderPageState = (): OrderPageProps => {
  const navigate = useNavigate();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [viewingItemsQuote, setViewingItemsQuote] = useState<QuoteData | null>(null);
  const [viewingCategoriesQuote, setViewingCategoriesQuote] = useState<QuoteData | null>(null);
  const [deletingQuote, setDeletingQuote] = useState<QuoteData | null>(null);

  const openCreateModal = () => {
    navigate("/quotes/create");
  };

  const openEditModal = (quote: QuoteData) => {
    navigate(`/quotes/edit/${quote.id}`);
  };

  const openViewItemsModal = (quote: QuoteData) => {
    setViewingItemsQuote(quote);
  };

  const closeViewItemsModal = () => {
    setViewingItemsQuote(null);
  };

  const openViewCategoriesModal = (quote: QuoteData) => {
    setViewingCategoriesQuote(quote);
  };

  const closeViewCategoriesModal = () => {
    setViewingCategoriesQuote(null);
  };

  const openConfirmModal = (quote: QuoteData) => {
    setDeletingQuote(quote);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setTimeout(() => setDeletingQuote(null), 200);
  };

  const onConfirmDelete = () => {
    console.log("Delete quote:", deletingQuote?.name);
  };

  return {
    isConfirmModalOpen,
    deletingQuote,
    viewingItemsQuote,
    viewingCategoriesQuote,
    openCreateModal,
    openEditModal,
    openViewItemsModal,
    closeViewItemsModal,
    openViewCategoriesModal,
    closeViewCategoriesModal,
    openConfirmModal,
    closeConfirmModal,
    onConfirmDelete,
  };
};
