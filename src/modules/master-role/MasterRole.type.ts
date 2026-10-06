import type { TableColumn } from "../../components/Table";
import type { MasterBase } from "../../types/master";

export type RoleData = MasterBase & {
  roleName: string;
};

export type MasterRoleProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: RoleData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
  columns: TableColumn<RoleData>[];
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
