import type { ReactElement, ReactNode } from "react";

export type TableActionName = "view" | "edit" | "delete";

export type TableActionHandlers<T> = {
  view?: (row: T) => void;
  edit?: (row: T) => void;
  delete?: (row: T) => void;
};

export type TableMobileColumn<T> = {
  primary?: boolean;
  render?: (row: T) => ReactNode;
};

export type TableColumn<T> = {
  key: string;
  header: ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
  sticky?: "left" | "right";
  mobile?: TableMobileColumn<T>;
  actions?: TableActionHandlers<T>;
  render?: (row: T, index: number) => ReactNode;
};

export type TableProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
  keyExtractor: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  isDetail?: boolean;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  emptyText?: string;
  isLoading?: boolean;
};

export type TableActionButtonProps<T> = {
  action: (row: T) => void;
  className: string;
  icon: ReactElement;
  label: string;
  row: T;
};

export type TableMobileRowProps<T> = {
  primaryColumns: TableColumn<T>[];
  row: T;
  tableProps: TableProps<T>;
};
