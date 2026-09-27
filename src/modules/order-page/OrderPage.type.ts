export type QuoteData = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  selectedItems: string[];
  qty: number;
  pph: number;
  discount: number;
  remark: string;
  status?: "Pending Payment" | "Confirmed" | "On Rental" | "Returned" | "Completed" | "Cancel";
};

export type OrderPageProps = {
  isConfirmModalOpen: boolean;
  deletingQuote: QuoteData | null;
  viewingItemsQuote?: QuoteData | null;
  viewingCategoriesQuote?: QuoteData | null;
  openCreateModal: () => void;
  openEditModal: (quote: QuoteData) => void;
  openViewItemsModal?: (quote: QuoteData) => void;
  closeViewItemsModal?: () => void;
  openViewCategoriesModal?: (quote: QuoteData) => void;
  closeViewCategoriesModal?: () => void;
  openConfirmModal: (quote: QuoteData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
};
