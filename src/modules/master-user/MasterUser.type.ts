import type { TableColumn } from "../../components/Table";
import type { MasterBase } from "../../types/master";

export type UserData = MasterBase & {
  username: string;
  role: "Admin" | "User";
};

export type MasterUserProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly paginatedData: readonly UserData[];
  readonly goToPage: (page: number) => void;
  readonly nextPage: () => void;
  readonly prevPage: () => void;
  readonly changePageSize: (size: number) => void;
  readonly totalCount: number;
  readonly columns: readonly TableColumn<UserData>[];
  onCreate: () => void;
  onEdit: (user: UserData) => void;
  onRowClick: (user: UserData) => void;
  
  onMore?: () => void;
  isMoreOpen?: boolean;
  onCloseMore?: () => void;
  onDelete?: () => void;
  onBack: () => void;
};

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (user: UserData) => void;
};

/** Navigation hook return type */
export type MasterUserNavigation = {
  readonly goBack: () => void;
  readonly goCreate: () => void;
  readonly goEdit: (item: UserData) => void;
  readonly goDetail: (item: UserData) => void;
};

/** Container state hook return type */
export type MasterUserContainerState = MasterUserNavigation & {
  readonly pagination: {
    readonly currentPage: number;
    readonly totalPages: number;
    readonly pageSize: number;
    readonly paginatedData: readonly UserData[];
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
