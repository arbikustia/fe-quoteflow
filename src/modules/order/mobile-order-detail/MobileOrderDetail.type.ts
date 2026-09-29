import type { QuoteData } from "../desktop-order/DesktopOrder.type";

/**
 * MobileOrderDetail Props type
 */
export type MobileOrderDetailProps = {
  order: QuoteData;
  isDeleteModalOpen: boolean;
  onCloseDeleteModal: () => void;
  onOpenDeleteModal: () => void;
  onNavigateBack: () => void;
  onNavigateEdit: () => void;
  onDeleteOrder: () => void;
};
