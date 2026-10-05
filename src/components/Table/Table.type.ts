import type { ReactNode } from "react";

export type TableColumn<T> = {
  key: string;
  header: ReactNode;
  align?: "left" | "center" | "right";
  render?: (row: T, index: number) => ReactNode;
};

export type TableProps<T> = {
  onRowClick?: (row: T) => void;
  data: T[];
  columns: TableColumn<T>[];
  keyExtractor: (row: T) => string | number;
};
