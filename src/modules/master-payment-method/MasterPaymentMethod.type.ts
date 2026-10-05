import type { MasterBase } from "../../types/master";
import type { TableColumn } from "../../components/Table";

export type PaymentMethodData = MasterBase & {
  name: string;
  description: string;
};

export type MasterPaymentMethodProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: PaymentMethodData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
  columns: TableColumn<PaymentMethodData>[];
  onCreate: () => void;
  onEdit: (paymentMethod: PaymentMethodData) => void;
  onRowClick: (paymentMethod: PaymentMethodData) => void;
};

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (paymentMethod: PaymentMethodData) => void;
};
