import type { MasterBase } from "../../types/master";
import type { TableColumn } from "../../components/Table";

export type VoucherData = MasterBase & {
  code: string;
  discountPercent: number;
};

export type MasterVoucherProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: VoucherData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
  columns: TableColumn<VoucherData>[];
  onCreate: () => void;
  onEdit: (voucher: VoucherData) => void;
  onRowClick: (voucher: VoucherData) => void;
  
  onMore?: () => void;
  isMoreOpen?: boolean;
  onCloseMore?: () => void;
  onDelete?: () => void;
  onBack: () => void;
};

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (voucher: VoucherData) => void;
};
