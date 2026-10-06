import type { TableColumn } from "../../components/Table";
import type { MasterBase } from "../../types/master";

export type RoleData = MasterBase & {
  roleName: string;
};

export type MasterRoleProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: readonly RoleData[];
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
  readonly totalCount: number;
  readonly columns: readonly TableColumn<RoleData>[];
  onCreate: () => void;
  onEdit: (role: RoleData) => void;
  onRowClick: (role: RoleData) => void;
  
  onMore?: () => void;
  isMoreOpen?: boolean;
  onCloseMore?: () => void;
  onDelete?: () => void;
  onBack: () => void;
};

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (role: RoleData) => void;
};

/** Navigation hook return type */
export type MasterRoleNavigation = {
  readonly goBack: () => void;
  readonly goCreate: () => void;
  readonly goEdit: (item: RoleData) => void;
  readonly goDetail: (item: RoleData) => void;
};

/** Container state hook return type */
export type MasterRoleContainerState = MasterRoleNavigation & {
  readonly pagination: {
    readonly currentPage: number;
    readonly totalPages: number;
    readonly pageSize: number;
    readonly paginatedData: readonly RoleData[];
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
