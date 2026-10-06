import type { TableColumn } from "../../components/Table";
import type { PaginationResult } from "../../hooks/usePagination";
import type { MasterBase } from "../../types/master";

export type PaymentTypeData = MasterBase & {
  readonly name: string;
};

export type MasterPaymentTypeNavigation = {
  readonly goBack: () => void;
  readonly goCreate: () => void;
  readonly goEdit: (paymentType: PaymentTypeData) => void;
  readonly goDetail: (paymentType: PaymentTypeData) => void;
};

export type MasterPaymentTypeContainerState = {
  readonly pagination: PaginationResult<PaymentTypeData>;
  readonly isMoreOpen: boolean;
  readonly toggleMore: () => void;
  readonly goDelete: () => void;
  readonly handleCloseMore: () => void;
};

export type MasterPaymentTypeProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: PaymentTypeData[];
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
  readonly totalCount: number;
  readonly columns: TableColumn<PaymentTypeData>[];
  readonly onCreate: () => void;
  readonly onEdit: (paymentType: PaymentTypeData) => void;
  readonly onRowClick: (paymentType: PaymentTypeData) => void;
  readonly onMore: () => void;
  readonly isMoreOpen: boolean;
  readonly onCloseMore: () => void;
  readonly onDelete: () => void;
  readonly onBack: () => void;
};

export type GetColumnsParams = {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly onEdit: (paymentType: PaymentTypeData) => void;
};
