export type PaginationHandlers = {
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  handleSearchTerm: (value: string) => void;
};

export type PaginationHandlerParams = {
  currentPage: number;
  totalPages: number;
  hasNext: boolean | undefined;
  hasPrevious: boolean | undefined;
  canPaginate: boolean;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearchTerm: (value: string) => void;
};
