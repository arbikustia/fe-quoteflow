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
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 ${className}`}>
      <div className="flex items-center gap-2">
        <select
          value={pageSize}
          onChange={(e): void => onPageSizeChange(Number(e.target.value))}
          className="border border-border-default rounded-xl px-4 py-2.5 bg-background-surface font-semibold text-text-primary focus:outline-none text-base min-w-[140px] cursor-pointer"
        >
          {DEFAULT_PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size} Documents
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={(): void => onPageChange(page)}
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition-colors text-base font-semibold ${
              currentPage === page
                ? "bg-background-subtle text-text-primary shadow-sm"
                : "hover:bg-background-subtle/50 text-text-secondary cursor-pointer"
            }`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
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
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-2 px-4 py-2.5 border border-border-default rounded-xl text-base font-semibold transition-colors ${
            currentPage === totalPages
              ? "text-text-disabled cursor-not-allowed bg-background-disabled"
              : "text-text-primary hover:bg-background-subtle bg-background-surface cursor-pointer"
          }`}
        >
          Next
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
