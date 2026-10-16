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
}: PaginationProps): React.ReactElement => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

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
      <div className="flex flex-wrap items-center gap-3 sm:justify-between">
        {totalItems !== undefined && (
          <p className="basis-full whitespace-nowrap text-sm text-text-secondary sm:basis-auto">
            Menampilkan {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, totalItems)} dari {totalItems} pelanggan
          </p>
        )}

        <select
          value={pageSize}
          onChange={(e): void => onPageSizeChange(Number(e.target.value))}
          aria-label="Documents per page"
          className="w-[180px] shrink-0 cursor-pointer rounded-xl border border-border-default bg-background-surface px-4 py-2.5 text-base font-semibold text-text-primary focus:outline-none sm:min-w-[140px] sm:w-auto"
        >
          {DEFAULT_PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size} Documents
            </option>
          ))}
        </select>

        <div className="ml-auto flex shrink-0 items-center justify-end gap-2">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`flex items-center gap-2 px-4 py-2.5 border border-border-default rounded-xl text-base font-semibold transition-colors ${
            currentPage === 1
              ? "text-text-disabled cursor-not-allowed bg-background-disabled"
              : "text-text-primary hover:bg-background-subtle bg-background-surface cursor-pointer"
          }`}
        >
          <FiChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex min-w-0 items-center justify-center gap-1 overflow-x-auto">
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
          className={`flex items-center gap-2 px-4 py-2.5 border border-border-default rounded-xl text-base font-semibold transition-colors ${
            currentPage === totalPages
              ? "text-text-disabled cursor-not-allowed bg-background-disabled"
              : "text-text-primary hover:bg-background-subtle bg-background-surface cursor-pointer"
          }`}
        >
          <span className="hidden sm:inline">Next</span>
          <FiChevronRight className="w-5 h-5" />
        </button>
        </div>
      </div>
    </div>
  );
};
