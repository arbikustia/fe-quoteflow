import type { TableColumn } from "../../../components/Table";

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

export type TabType = "All Orders" | "Pending Payment" | "Confirmed" | "On Rental" | "Returned" | "Completed" | "Cancel";

export type BaseDesktopOrderState = {
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

export type OrderTabsProps = {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  statusCounts: Record<string, number>;
  TABS: readonly TabType[];
};

export type OrderToolbarProps = {
  pageSize: number;
  totalCount: number;
  changePageSize: (size: number) => void;
};

export type OrderHeaderProps = {
  openCreateModal: () => void;
};

export type OrderTableContainerProps = OrderTabsProps & OrderToolbarProps & {
  paginatedData: QuoteData[];
  columns: TableColumn<QuoteData>[];
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
};

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  openViewCategoriesModal?: (quote: QuoteData) => void;
  openViewItemsModal?: (quote: QuoteData) => void;
  openEditModal: (quote: QuoteData) => void;
  openConfirmModal: (quote: QuoteData) => void;
};

export type DesktopOrderProps = BaseDesktopOrderState & OrderTabsProps & {
  columns: TableColumn<QuoteData>[];
  paginatedData: QuoteData[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
};

export type CategoryDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  quote: QuoteData | null | undefined;
};

export type ItemDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  quote: QuoteData | null | undefined;
};
