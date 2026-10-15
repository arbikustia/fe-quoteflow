import type { CustomerData } from "../MasterCustomer.type";

export type MasterCustomerDetailMenuState = {
  readonly isMoreOpen: boolean;
  readonly isDeleteModalOpen: boolean;
  readonly toggleMore: () => void;
  readonly closeMore: () => void;
  readonly openDeleteModal: () => void;
  readonly closeDeleteModal: () => void;
};

export type MasterCustomerDetailState = {
  readonly customer: CustomerData | null;
  readonly isMoreOpen: boolean;
  readonly isDeleteModalOpen: boolean;
  readonly goBack: () => void;
  readonly toggleMore: () => void;
  readonly closeMore: () => void;
  readonly openDeleteModal: () => void;
  readonly closeDeleteModal: () => void;
  readonly goEdit: () => void;
  readonly handleDelete: () => void;
};

