import * as React from "react";

import { Pagination } from "../Pagination";

import { renderDesktopTable, renderMobileCards } from "./Table.helpers";
import type { TableProps } from "./Table.type";

/**
 * Render Table Component.
 * @param {TableProps<T>} props - Table component props
 * @returns {React.ReactElement} Table component
 */
export const TableComponent = <T,>(props: TableProps<T>): React.ReactElement => {
  const { currentPage, totalPages, pageSize, onPageChange, onPageSizeChange } = props;
  const hasPagination = currentPage !== undefined
    && totalPages !== undefined
    && pageSize !== undefined
    && onPageChange !== undefined
    && onPageSizeChange !== undefined;

  return (
    <div className="flex flex-col bg-transparent overflow-hidden">
      <div className="hidden md:flex flex-1 overflow-auto">{renderDesktopTable(props)}</div>
      <div className="md:hidden bg-background-surface rounded-xl border border-border-default shadow-sm overflow-hidden">
        {renderMobileCards(props)}
      </div>
      {hasPagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          className="mt-2"
        />
      )}
    </div>
  );
};
