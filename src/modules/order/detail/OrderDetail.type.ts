import type { QuoteData } from "../Order.type";

/**
 * OrderDetail Props type
 */
export type OrderDetailProps = {
  order: QuoteData;
  isDeleteModalOpen: boolean;
  onCloseDeleteModal: () => void;
  onOpenDeleteModal: () => void;
  onNavigateBack: () => void;
  onNavigateEdit: () => void;
  onDeleteOrder: () => void;
};
