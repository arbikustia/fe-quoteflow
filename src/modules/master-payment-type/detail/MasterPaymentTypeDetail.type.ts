import type { PaymentTypeData } from "../MasterPaymentType.type";

export type MasterPaymentTypeDetailMenuState = {
  readonly isMoreOpen: boolean;
  readonly isDeleteModalOpen: boolean;
  readonly toggleMore: () => void;
  readonly closeMore: () => void;
  readonly openDeleteModal: () => void;
  readonly closeDeleteModal: () => void;
};

export type MasterPaymentTypeDetailState = MasterPaymentTypeDetailMenuState & {
  readonly paymentType: PaymentTypeData | null;
  readonly goBack: () => void;
  readonly goEdit: () => void;
  readonly handleDelete: () => void;
};
