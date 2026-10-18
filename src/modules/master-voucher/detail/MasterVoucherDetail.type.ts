import type { VoucherData } from "../MasterVoucher.type";

export type MasterVoucherDetailMenuState = {
  isMoreOpen: boolean;
  isDeleteModalOpen: boolean;
  toggleMore: () => void;
  closeMore: () => void;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
};

export type MasterVoucherDetailState = MasterVoucherDetailMenuState & {
  voucher: VoucherData | null;
  goBack: () => void;
  goEdit: () => void;
  handleDelete: () => void;
};
