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
  status?: "Pending" | "Approved" | "Completed" | "On Rental";
};

export type QuotesProps = {
  isConfirmModalOpen: boolean;
  deletingQuote: QuoteData | null;
  openCreateModal: () => void;
  openEditModal: (quote: QuoteData) => void;
  openConfirmModal: (quote: QuoteData) => void;
  closeConfirmModal: () => void;
  onConfirmDelete: () => void;
};
