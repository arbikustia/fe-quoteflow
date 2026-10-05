import type { MasterBase } from "../../types/master";
import type { TableColumn } from "../../components/Table";

export type CategoryData = MasterBase & {
  categoryName: string;
};

export type MasterCategoryProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: CategoryData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
  columns: TableColumn<CategoryData>[];
  onCreate: () => void;
  onEdit: (category: CategoryData) => void;
  onRowClick: (category: CategoryData) => void;
};

export type GetColumnsParams = {
  currentPage: number;
  pageSize: number;
  onEdit: (category: CategoryData) => void;
};
