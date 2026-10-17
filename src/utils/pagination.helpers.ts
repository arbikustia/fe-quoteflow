import type {
  PaginationHandlerParams,
  PaginationHandlers,
} from "@/types/pagination.type";

/**
 * Build pagination navigation handlers.
 * @param {PaginationHandlerParams} params - Navigation parameters
 * @returns {PaginationHandlers} Navigation handlers
 */
export const createPaginationHandlers = (
  params: PaginationHandlerParams,
): PaginationHandlers => {
  /**
   * Jump to specific page number within valid range.
   * @param {number} page - Destination page
   * @returns {void}
   */
  const goToPage = (page: number): void => {
    params.setCurrentPage(Math.max(1, Math.min(page, params.totalPages)));
  };

  /**
   * Navigate to next page if allowed.
   * @returns {void}
   */
  const nextPage = (): void => {
    if (params.canPaginate && params.hasNext) {
      goToPage(params.currentPage + 1);
    }
  };

  /**
   * Navigate to previous page if allowed.
   * @returns {void}
   */
  const prevPage = (): void => {
    if (params.canPaginate && params.hasPrevious) {
      goToPage(params.currentPage - 1);
    }
  };

  /**
   * Change page size and reset current page to 1.
   * @param {number} size - New page size
   * @returns {void}
   */
  const changePageSize = (size: number): void => {
    params.setPageSize(size);
    params.setCurrentPage(1);
  };

  /**
   * Update search term and reset current page to 1.
   * @param {string} value - Search keyword
   * @returns {void}
   */
  const handleSearchTerm = (value: string): void => {
    params.setSearchTerm(value);
    params.setCurrentPage(1);
  };

  return { goToPage, nextPage, prevPage, changePageSize, handleSearchTerm };
};
