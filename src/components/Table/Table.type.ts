import type { ReactElement, ReactNode } from "react";

export type TableActionName = "view" | "edit" | "delete";

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

export type TableActionButtonProps<T> = {
  readonly action: (row: T) => void;
  readonly className: string;
  readonly icon: ReactElement;
  readonly label: string;
  readonly row: T;
};

export type TableMobileRowProps<T> = {
  readonly primaryColumns: readonly TableColumn<T>[];
  readonly row: T;
  readonly tableProps: TableProps<T>;
};
