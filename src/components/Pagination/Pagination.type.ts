export type PaginationNavigationProps = {
  currentPage: number;
  totalPages: number;
  isCompact: boolean;
  onPageChange: (page: number) => void;
};

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  className?: string;
  totalItems?: number;
  isCompact?: boolean;
};
