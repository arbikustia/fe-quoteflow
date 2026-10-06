import type { TableColumn } from "../../components/Table";
import type { MasterBase } from "../../types/master";

/** Customer data model */
export type CustomerData = MasterBase & {
  readonly name: string;
  readonly address: string;
  readonly phoneNumber: string;
};

/** Navigation hooks return type */
export type MasterCustomerNavigation = {
  readonly goBack: () => void;
  readonly goCreate: () => void;
  readonly goEdit: (customer: CustomerData) => void;
  readonly goDetail: (customer: CustomerData) => void;
};

/** Pagination state type */
export type MasterCustomerPagination = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: CustomerData[];
  readonly totalCount: number;
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
};

/** Container state hook return type */
export type MasterCustomerContainerState = {
  readonly pagination: MasterCustomerPagination;
  readonly isMoreOpen: boolean;
  readonly toggleMore: () => void;
  readonly handleCloseMore: () => void;
  readonly goDelete: () => void;
};

/** Component props */
export type MasterCustomerProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: CustomerData[];
  readonly totalCount: number;
  readonly columns: TableColumn<CustomerData>[];
  readonly isMoreOpen: boolean;
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
  readonly onCreate: () => void;
  readonly onEdit: (customer: CustomerData) => void;
  readonly onRowClick: (customer: CustomerData) => void;
  readonly onBack: () => void;
  readonly onMore: () => void;
  readonly onCloseMore: () => void;
  readonly onDelete: () => void;
};

/** Get columns parameters */
export type GetColumnsParams = {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly onEdit: (customer: CustomerData) => void;
};
