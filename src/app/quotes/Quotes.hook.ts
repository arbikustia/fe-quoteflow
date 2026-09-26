import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { QuoteData } from './Quotes.type';

export const useQuotesState = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<QuoteData | null>(null);
  const [deletingQuote, setDeletingQuote] = useState<QuoteData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const openCreateModal = () => {
    navigate('/quotes/create');
  };

  const openEditModal = (quote: QuoteData) => {
    navigate(`/quotes/edit/${quote.id}`);
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
    deletingQuote,
    selectedCategory,
    setSelectedCategory,
    openCreateModal,
    openEditModal,
    closeModal,
    openConfirmModal,
    closeConfirmModal,
    onConfirmDelete,
  };
};
