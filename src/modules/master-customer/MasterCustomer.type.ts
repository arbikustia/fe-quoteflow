import type { TableColumn } from "../../components/Table";
import type { MasterBase } from "../../types/master";

export type CustomerData = MasterBase & {
  name: string;
  address: string;
  phoneNumber: string;
};

export type MasterCustomerProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: CustomerData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
  columns: TableColumn<CustomerData>[];
  onCreate: () => void;
  onEdit: (customer: CustomerData) => void;
  onRowClick: (customer: CustomerData) => void;
  
  onMore?: () => void;
  isMoreOpen?: boolean;
  onCloseMore?: () => void;
  onDelete?: () => void;
  onBack: () => void;
};

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (customer: CustomerData) => void;
};
