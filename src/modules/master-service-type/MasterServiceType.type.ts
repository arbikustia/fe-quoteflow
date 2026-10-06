import type { TableColumn } from "../../components/Table";
import type { MasterBase } from "../../types/master";

export type ServiceTypeData = MasterBase & {
  name: string;
  price: number;
  isActive: boolean;
};

export type MasterServiceTypeProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: readonly ServiceTypeData[];
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
  readonly totalCount: number;
  readonly columns: readonly TableColumn<ServiceTypeData>[];
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

/** Navigation hook return type */
export type MasterServiceTypeNavigation = {
  readonly goBack: () => void;
  readonly goCreate: () => void;
  readonly goEdit: (item: ServiceTypeData) => void;
  readonly goDetail: (item: ServiceTypeData) => void;
};

/** Container state hook return type */
export type MasterServiceTypeContainerState = MasterServiceTypeNavigation & {
  readonly pagination: {
    readonly currentPage: number;
    readonly totalPages: number;
    readonly pageSize: number;
    readonly paginatedData: readonly ServiceTypeData[];
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
