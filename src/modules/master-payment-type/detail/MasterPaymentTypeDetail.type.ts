import type { PaymentTypeData } from "../MasterPaymentType.type";

export type MasterPaymentTypeDetailMenuState = {
  isMoreOpen: boolean;
  isDeleteModalOpen: boolean;
  toggleMore: () => void;
  closeMore: () => void;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
};

export type MasterPaymentTypeDetailState = MasterPaymentTypeDetailMenuState & {
  paymentType: PaymentTypeData | null;
  goBack: () => void;
  goEdit: () => void;
  handleDelete: () => void;
};
