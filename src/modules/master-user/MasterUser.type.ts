import type { MasterBase } from "../../types/master";
import type { TableColumn } from "../../components/Table";

export type UserData = MasterBase & {
  username: string;
  role: "Admin" | "User";
};

export type MasterUserProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: UserData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
  columns: TableColumn<UserData>[];
  onCreate: () => void;
  onEdit: (user: UserData) => void;
  onRowClick: (user: UserData) => void;
};

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (user: UserData) => void;
};
