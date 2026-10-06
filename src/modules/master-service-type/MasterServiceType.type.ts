import type { MasterBase } from "../../types/master";
import type { TableColumn } from "../../components/Table";

export type ServiceTypeData = MasterBase & {
  name: string;
  price: number;
  isActive: boolean;
};

export type MasterServiceTypeProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: ServiceTypeData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
  columns: TableColumn<ServiceTypeData>[];
  onCreate: () => void;
  onEdit: (serviceType: ServiceTypeData) => void;
  onRowClick: (serviceType: ServiceTypeData) => void;
  
  onMore?: () => void;
  isMoreOpen?: boolean;
  onCloseMore?: () => void;
  onDelete?: () => void;
  onBack: () => void;
};

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (serviceType: ServiceTypeData) => void;
};
