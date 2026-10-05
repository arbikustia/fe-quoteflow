import type { MasterBase } from "../../types/master";
import type { TableColumn } from "../../components/Table";

export type PaymentTypeData = MasterBase & {
  name: string;
};

export type MasterPaymentTypeProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: PaymentTypeData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
  columns: TableColumn<PaymentTypeData>[];
  onCreate: () => void;
  onEdit: (paymentType: PaymentTypeData) => void;
  onRowClick: (paymentType: PaymentTypeData) => void;
};

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (paymentType: PaymentTypeData) => void;
};
