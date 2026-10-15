import type { PaymentMethodData } from "../MasterPaymentMethod.type";

export type MasterPaymentMethodDetailMenuState = {
  readonly isMoreOpen: boolean;
  readonly isDeleteModalOpen: boolean;
  readonly toggleMore: () => void;
  readonly closeMore: () => void;
  readonly openDeleteModal: () => void;
  readonly closeDeleteModal: () => void;
};

export type MasterPaymentMethodDetailState = {
  readonly paymentMethod: PaymentMethodData | null;
  readonly isMoreOpen: boolean;
  readonly isDeleteModalOpen: boolean;
  readonly goBack: () => void;
  readonly toggleMore: () => void;
  readonly closeMore: () => void;
  readonly goEdit: () => void;
  readonly openDeleteModal: () => void;
  readonly closeDeleteModal: () => void;
  readonly handleDelete: () => void;
};
