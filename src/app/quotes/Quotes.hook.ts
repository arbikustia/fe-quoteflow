import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { QuoteData } from "./Quotes.type";

export const useQuotesState = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<QuoteData | null>(null);
  const [viewingItemsQuote, setViewingItemsQuote] = useState<QuoteData | null>(null);
  const [viewingCategoriesQuote, setViewingCategoriesQuote] = useState<QuoteData | null>(null);
  const [deletingQuote, setDeletingQuote] = useState<QuoteData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

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

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setEditingQuote(null);
      setSelectedCategory("");
    }, 200);
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
    isModalOpen,
    isConfirmModalOpen,
    editingQuote,
    viewingItemsQuote,
    viewingCategoriesQuote,
    deletingQuote,
    selectedCategory,
    setSelectedCategory,
    openCreateModal,
    openEditModal,
    openViewItemsModal,
    closeViewItemsModal,
    openViewCategoriesModal,
    closeViewCategoriesModal,
    closeModal,
    openConfirmModal,
    closeConfirmModal,
    onConfirmDelete,
  };
};
