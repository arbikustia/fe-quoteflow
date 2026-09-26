import type { ReactNode } from "react";

export type TableColumn<T> = {
  key: string;
  header: ReactNode;
  align?: "left" | "center" | "right";
  render?: (row: T) => ReactNode;
};

export type TableProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
  keyExtractor: (row: T) => string | number;
};
