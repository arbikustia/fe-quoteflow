import type { PaymentMethodData } from "../MasterPaymentMethod.type";

export type MasterPaymentMethodDetailMenuState = {
  isMoreOpen: boolean;
  isDeleteModalOpen: boolean;
  toggleMore: () => void;
  closeMore: () => void;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
};

export type MasterPaymentMethodDetailState = {
  paymentMethod: PaymentMethodData | null;
  isMoreOpen: boolean;
  isDeleteModalOpen: boolean;
  goBack: () => void;
  toggleMore: () => void;
  closeMore: () => void;
  goEdit: () => void;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
  handleDelete: () => void;
};
