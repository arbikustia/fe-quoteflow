import type { TableColumn } from "../../components/Table";
import type { PaginationResult } from "../../hooks/usePagination";
import type { MasterBase } from "../../types/master";

export type PaymentMethodData = MasterBase & {
  readonly name: string;
  readonly description: string;
};

export type MasterPaymentMethodProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: PaymentMethodData[];
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
  readonly totalCount: number;
  readonly columns: TableColumn<PaymentMethodData>[];
  readonly onCreate: () => void;
  readonly onEdit: (paymentMethod: PaymentMethodData) => void;
  readonly onRowClick: (paymentMethod: PaymentMethodData) => void;
  readonly onMore: () => void;
  readonly isMoreOpen: boolean;
  readonly onCloseMore: () => void;
  readonly onDelete: () => void;
  readonly onBack: () => void;
};

export type GetColumnsParams = {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly onEdit: (paymentMethod: PaymentMethodData) => void;
};

export type MasterPaymentMethodNavigation = {
  readonly goBack: () => void;
  readonly goCreate: () => void;
  readonly goEdit: (p: PaymentMethodData) => void;
  readonly goDetail: (p: PaymentMethodData) => void;
};

export type MasterPaymentMethodContainerState = {
  readonly pagination: PaginationResult<PaymentMethodData>;
  readonly isMoreOpen: boolean;
  readonly toggleMore: () => void;
  readonly goDelete: () => void;
  readonly handleCloseMore: () => void;
};
