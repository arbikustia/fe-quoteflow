import type * as React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import type { PaginationProps } from "./Pagination.type";

const DEFAULT_PAGE_SIZES: readonly number[] = [5, 10, 20, 50, 100];

/**
 * Render Pagination Component
 * @param {PaginationProps} props - props
 * @returns {React.ReactElement} node
 */
export const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  className = "",
  totalItems,
  isCompact = false,
}: PaginationProps): React.ReactElement => {
  const pages = isCompact ? [currentPage] : Array.from({ length: totalPages }, (_, i) => i + 1);

  /**
   * Handle previous page
   * @returns {void}
   */
  const handlePrevPage = (): void => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  /**
   * Handle next page
   * @returns {void}
   */
  const handleNextPage = (): void => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className={`flex flex-col gap-3 py-4 ${className}`}>
      <div className="flex w-full items-center justify-between gap-2 overflow-x-auto">
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {totalItems !== undefined && (
            <p className="whitespace-nowrap text-xs sm:text-sm text-text-secondary">
              Show {totalItems === 0 ? 0 : Math.min(currentPage * pageSize, totalItems) - (currentPage - 1) * pageSize}/{pageSize} data
            </p>
          )}

          <select
            value={pageSize}
            onChange={(e): void => onPageSizeChange(Number(e.target.value))}
            aria-label="Documents per page"
            className={`${isCompact ? "px-4 py-2.5 text-base" : "w-[180px] px-4 py-2.5 text-base sm:min-w-[100px] sm:w-auto"} shrink-0 cursor-pointer rounded-xl border border-border-default bg-background-surface font-semibold text-text-primary focus:outline-none`}
          >
            {DEFAULT_PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 ${isCompact ? "p-2.5" : "px-2.5 sm:px-4 py-1.5 sm:py-2.5"} border border-border-default rounded-xl text-base font-semibold transition-colors ${
              currentPage === 1
                ? "text-text-disabled cursor-not-allowed bg-background-disabled"
                : "text-text-primary hover:bg-background-subtle bg-background-surface cursor-pointer"
            }`}
          >
            <FiChevronLeft className="w-3.5 h-5 sm:w-5 sm:h-5" />
            <span className={isCompact ? "hidden" : "hidden sm:inline"}>Previous</span>
          </button>

          <div className="flex min-w-0 items-center justify-center gap-1">
            {pages.map((page) => (
              <button
                key={page}
                onClick={(): void => onPageChange(page)}
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-base font-semibold transition-colors ${
                  currentPage === page
                    ? "bg-background-subtle text-text-primary shadow-sm"
                    : "cursor-pointer text-text-secondary hover:bg-background-subtle/50"
                }`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-2 ${isCompact ? "p-2.5" : "px-2.5 sm:px-4 py-1.5 sm:py-2.5"} border border-border-default rounded-xl text-base font-semibold transition-colors ${
              currentPage === totalPages
                ? "text-text-disabled cursor-not-allowed bg-background-disabled"
                : "text-text-primary hover:bg-background-subtle bg-background-surface cursor-pointer"
            }`}
          >
            <span className={isCompact ? "hidden" : "hidden sm:inline"}>Next</span>
            <FiChevronRight className="w-3.5 h-5 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
