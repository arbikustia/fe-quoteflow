import type { ReactNode } from "react";
import type { MasterBase } from "../../types/master";
import type { TableColumn } from "../../components/Table";

export type ItemData = MasterBase & {
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  duration: string;
  remark: string;
  unit: string; // added this as it appeared in detail component
};

export type MasterItemProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: ItemData[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
  columns: TableColumn<ItemData>[];
  onCreate: () => void;
  onEdit: (item: ItemData) => void;
  onRowClick: (item: ItemData) => void;
};

export type ItemToolbarProps = {
  pageSize: number;
  totalCount: number;
  changePageSize: (size: number) => void;
};

export type ItemActionProps = {
  row: ItemData;
  onEdit: (item: ItemData) => void;
  onConfirm: (item: ItemData) => void;
};
