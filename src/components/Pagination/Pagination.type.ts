export type PaginationProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly pageSize: number;
  readonly totalCount: number;
  readonly onPageChange: (page: number) => void;
  readonly onNextPage: () => void;
  readonly onPrevPage: () => void;
  readonly onPageSizeChange?: (size: number) => void;
  readonly showPageSizeOptions?: boolean;
};

export type PaginationHeaderProps = Pick<PaginationProps, "pageSize" | "totalCount" | "onPageSizeChange" | "showPageSizeOptions">;
export type PaginationFooterProps = Pick<PaginationProps, "currentPage" | "totalPages" | "onPageChange" | "onNextPage" | "onPrevPage">;
