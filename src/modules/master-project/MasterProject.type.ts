import type { MasterBase } from "../../types/master";
import type { TableColumn } from "../../components/Table";

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
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: ProjectData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
  columns: TableColumn<ProjectData>[];
  onCreate: () => void;
  onEdit: (project: ProjectData) => void;
  onRowClick: (project: ProjectData) => void;
};

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (project: ProjectData) => void;
};
