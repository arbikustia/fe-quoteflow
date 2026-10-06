import type { TableColumn } from "../../components/Table";
import type { MasterBase } from "../../types/master";

export type ProjectItem = {
  itemId: string;
  qty: number;
};

export type ProjectData = MasterBase & {
  name: string;
  items: ProjectItem[];
  remark: string;
};

export type MasterProjectProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: readonly ProjectData[];
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
  readonly totalCount: number;
  readonly columns: readonly TableColumn<ProjectData>[];
  onCreate: () => void;
  onEdit: (project: ProjectData) => void;
  onRowClick: (project: ProjectData) => void;
  
  onMore?: () => void;
  isMoreOpen?: boolean;
  onCloseMore?: () => void;
  onDelete?: () => void;
  onBack: () => void;
};

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (project: ProjectData) => void;
};

/** Navigation hook return type */
export type MasterProjectNavigation = {
  readonly goBack: () => void;
  readonly goCreate: () => void;
  readonly goEdit: (item: ProjectData) => void;
  readonly goDetail: (item: ProjectData) => void;
};

/** Container state hook return type */
export type MasterProjectContainerState = MasterProjectNavigation & {
  readonly pagination: {
    readonly currentPage: number;
    readonly totalPages: number;
    readonly pageSize: number;
    readonly paginatedData: readonly ProjectData[];
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
