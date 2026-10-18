import type { ReactNode } from "react";

export type TableActionHandlers<T> = {
  readonly view?: (row: T) => void;
  readonly edit?: (row: T) => void;
  readonly delete?: (row: T) => void;
};

export type TableMobileColumn<T> = {
  readonly primary?: boolean;
  readonly render?: (row: T) => ReactNode;
};

export type TableColumn<T> = {
  readonly key: string;
  readonly header: ReactNode;
  readonly align?: "left" | "center" | "right";
  readonly width?: string;
  readonly sticky?: "left" | "right";
  readonly mobile?: TableMobileColumn<T>;
  readonly actions?: TableActionHandlers<T>;
  readonly render?: (row: T, index: number) => ReactNode;
};

export type TableProps<T> = {
  readonly data: readonly T[];
  readonly columns: readonly TableColumn<T>[];
  readonly keyExtractor: (row: T) => string | number;
  readonly onRowClick?: (row: T) => void;
  readonly isDetail?: boolean;
  readonly currentPage?: number;
  readonly totalPages?: number;
  readonly pageSize?: number;
  readonly totalCount?: number;
  readonly onPageChange?: (page: number) => void;
  readonly onPageSizeChange?: (size: number) => void;
  readonly emptyText?: string;
  readonly isLoading?: boolean;
};
