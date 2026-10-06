import type { TableColumn } from "../../components/Table";
import type { MasterBase } from "../../types/master";

export type VoucherData = MasterBase & {
  code: string;
  discountPercent: number;
};

export type MasterVoucherProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: readonly VoucherData[];
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
  readonly totalCount: number;
  readonly columns: readonly TableColumn<VoucherData>[];
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

/** Navigation hook return type */
export type MasterVoucherNavigation = {
  readonly goBack: () => void;
  readonly goCreate: () => void;
  readonly goEdit: (item: VoucherData) => void;
  readonly goDetail: (item: VoucherData) => void;
};

/** Container state hook return type */
export type MasterVoucherContainerState = MasterVoucherNavigation & {
  readonly pagination: {
    readonly currentPage: number;
    readonly totalPages: number;
    readonly pageSize: number;
    readonly paginatedData: readonly VoucherData[];
    readonly goToPage: (page: number) => void;
    readonly nextPage: () => void;
    readonly prevPage: () => void;
    readonly changePageSize: (size: number) => void;
    readonly totalCount: number;
  };
  readonly isMoreOpen: boolean;
  readonly toggleMore: () => void;
  readonly goDelete: () => void;
  readonly handleCloseMore: () => void;
};
