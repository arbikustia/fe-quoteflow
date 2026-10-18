import type * as React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import type { PaginationNavigationProps, PaginationProps } from "./Pagination.type";

const DEFAULT_PAGE_SIZES: readonly number[] = [5, 10, 20, 50, 100];

/**
 * Render page number buttons.
 * @param {readonly number[]} pages - Page numbers
 * @param {number} currentPage - Active page
 * @param {(page: number) => void} onPageChange - Page change handler
 * @returns {React.ReactElement} Page buttons
 */
const _renderPageButtons = (pages: readonly number[], currentPage: number, onPageChange: (page: number) => void): React.ReactElement => (
  <div className="flex min-w-0 items-center justify-center gap-1">
    {pages.map((page, index) => (
      page === 0 ? (
        <span key={`ellipsis-${index}`} aria-hidden="true" className="flex h-10 w-6 items-center justify-center text-text-tertiary">…</span>
      ) : (
        <button type="button" key={page} onClick={(): void => onPageChange(page)} aria-current={currentPage === page ? "page" : undefined} className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition-colors ${currentPage === page ? "bg-action-primary text-text-inverse shadow-sm" : "text-text-secondary hover:bg-background-subtle"}`}>
          {page}
        </button>
      )
    ))}
  </div>
);

/**
 * Get visible pagination pages.
 * @param {number} currentPage - Active page
 * @param {number} totalPages - Total page count
 * @param {boolean} isCompact - Compact layout flag
 * @returns {readonly number[]} Visible pages; zero represents an ellipsis
 */
const _getVisiblePages = (currentPage: number, totalPages: number, isCompact: boolean): readonly number[] => {
  if (isCompact) {
    return [currentPage];
  }

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const startPage = Math.max(2, Math.min(currentPage - 2, totalPages - 6));
  const middlePages = Array.from({ length: 5 }, (_, index) => startPage + index);
  const hasLeadingEllipsis = currentPage > 4;
  const hasTrailingEllipsis = currentPage < totalPages - 3;

  return [1, ...(hasLeadingEllipsis ? [0] : []), ...middlePages, ...(hasTrailingEllipsis ? [0] : []), totalPages];
};

/**
 * Render page navigation buttons.
 * @param {PaginationNavigationProps} props - Navigation props
 * @returns {React.ReactElement} Navigation buttons
 */
const _renderNavigation = (props: PaginationNavigationProps): React.ReactElement => {
  const { currentPage, totalPages, isCompact, onPageChange } = props;
  const pages = _getVisiblePages(currentPage, totalPages, isCompact);
  const previousDisabled = currentPage === 1;
  const nextDisabled = currentPage === totalPages;
  const navigationClass = "flex h-10 items-center justify-center gap-1 rounded-xl border border-border-default text-sm font-semibold transition-colors";
  const enabledClass = "bg-background-surface text-text-primary hover:bg-background-subtle";
  const disabledClass = "cursor-not-allowed bg-background-disabled text-text-disabled";
  const buttonSizeClass = isCompact ? "w-10" : "px-3 sm:px-4";
  const previousStateClass = previousDisabled ? disabledClass : enabledClass;
  const nextStateClass = nextDisabled ? disabledClass : enabledClass;

  return (
    <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-2">
      <button type="button" onClick={(): void => {
          if (!previousDisabled) {
            onPageChange(currentPage - 1);
          }
        }} disabled={previousDisabled} aria-label="Previous" className={`${navigationClass} ${buttonSizeClass} ${previousStateClass}`}>
        <FiChevronLeft className="h-5 w-3.5 sm:h-5 sm:w-5" />
        <span className={isCompact ? "sr-only" : "hidden sm:inline"}>Previous</span>
      </button>
      {_renderPageButtons(pages, currentPage, onPageChange)}
      <button type="button" onClick={(): void => {
          if (!nextDisabled) {
            onPageChange(currentPage + 1);
          }
        }} disabled={nextDisabled} aria-label="Next" className={`${navigationClass} ${buttonSizeClass} ${nextStateClass}`}>
        <span className={isCompact ? "sr-only" : "hidden sm:inline"}>Next</span>
        <FiChevronRight className="h-5 w-3.5 sm:h-5 sm:w-5" />
      </button>
    </div>
  );
};

/**
 * Render pagination component.
 * @param {PaginationProps} props - Pagination props
 * @returns {React.ReactElement} Pagination component
 */
export const Pagination = (props: PaginationProps): React.ReactElement => {
  const { currentPage, pageSize, onPageSizeChange, className = "", totalItems, isCompact = false, totalPages, onPageChange } = props;
  let visibleItems: number | undefined;

  if (totalItems !== undefined) {
    visibleItems = totalItems === 0 ? 0 : Math.min(currentPage * pageSize, totalItems) - (currentPage - 1) * pageSize;
  }

  return (
    <div className={`flex flex-col gap-3 py-4 ${className}`}>
      <div className="flex w-full items-center justify-between gap-2 overflow-x-auto">
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {visibleItems !== undefined && <p className="whitespace-nowrap text-xs text-text-secondary sm:text-sm">Show {visibleItems}/{pageSize} data</p>}
          <select value={pageSize} onChange={(event): void => onPageSizeChange(Number(event.target.value))} aria-label="Documents per page" className={`${isCompact ? "px-4 py-2.5 text-base" : "w-[180px] px-4 py-2.5 text-base sm:w-auto sm:min-w-[100px]"} shrink-0 cursor-pointer rounded-xl border border-border-default bg-background-surface font-semibold text-text-primary focus:outline-none`}>
            {DEFAULT_PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </div>
        {_renderNavigation({ currentPage, totalPages, isCompact, onPageChange })}
      </div>
    </div>
  );
};

export default Pagination;
