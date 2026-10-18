export type PaginationNavigationProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly isCompact: boolean;
  readonly onPageChange: (page: number) => void;
};

export type PaginationProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly onPageChange: (page: number) => void;
  readonly onPageSizeChange: (size: number) => void;
  readonly className?: string;
  readonly totalItems?: number;
  readonly isCompact?: boolean;
};
