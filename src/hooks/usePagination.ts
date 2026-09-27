import { useMemo, useState } from "react";

export type PaginationResult<T> = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: T[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
  totalCount: number;
};

/**
 * Custom hook for pagination logic
 * @param {T[]} data - The data array to paginate
 * @param {number} initialPageSize - Initial size of the page
 * @returns {PaginationResult<T>} Pagination state and handlers
 */
export function usePagination<T>(data: T[], initialPageSize: number = 5): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  
  // Safely bound the current page so we don't need a useEffect
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

  const paginatedData = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, safeCurrentPage, pageSize]);

  const goToPage = (page: number): void => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = (): void => {
    if (safeCurrentPage < totalPages) {
      setCurrentPage(safeCurrentPage + 1);
    }
  };

  const prevPage = (): void => {
    if (safeCurrentPage > 1) {
      setCurrentPage(safeCurrentPage - 1);
    }
  };

  const changePageSize = (newSize: number): void => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  return {
    currentPage: safeCurrentPage,
    totalPages,
    pageSize,
    paginatedData,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    totalCount: data.length,
  };
}
