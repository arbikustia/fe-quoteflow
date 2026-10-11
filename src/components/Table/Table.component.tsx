import * as React from "react";
import { FiEdit2, FiEye,FiTrash2 } from "react-icons/fi";

import type { TableColumn, TableProps } from "./Table.type";

const DEFAULT_PAGE_SIZES: readonly number[] = [5, 10, 20, 50, 100];

const _getCellValue = <T extends object>(row: T, key: string): React.ReactNode => {
  const entry = Object.entries(row).find(([name]) => name === key);
  const value = entry?.[1];

  if (React.isValidElement(value) || typeof value === "string" || typeof value === "number") {
    return value;
  }

  return null;
};

const _renderCellContent = <T extends object,>(col: TableColumn<T>, row: T, index: number): React.ReactNode => {
  if (col.actions) {
    return (
      <div className="flex items-center justify-center gap-1.5">
        {col.actions.view && (
          renderActionButton(
            <FiEye className="w-4 h-4" />,
            col.actions.view,
            row,
            "View",
            "View",
            "text-text-tertiary hover:text-action-primary hover:bg-action-primary-subtle"
          )
        )}
        {col.actions.edit && (
          renderActionButton(
            <FiEdit2 className="w-4 h-4" />,
            col.actions.edit,
            row,
            "Edit",
            "Edit",
            "text-text-tertiary hover:text-action-primary hover:bg-action-primary-subtle"
          )
        )}
        {col.actions.delete && (
          renderActionButton(
            <FiTrash2 className="w-4 h-4" />,
            col.actions.delete,
            row,
            "Delete",
            "Delete",
            "text-text-tertiary hover:text-danger hover:bg-danger-subtle"
          )
        )}
      </div>
    ) as React.ReactNode;
  }
  if (col.render) {
    return col.render(row, index);
  }
  return _getCellValue(row, col.key);
};

const _renderMobileCellContent = <T extends object,>(col: TableColumn<T>, row: T): React.ReactNode => {
  if (col.mobile?.render) {
    return col.mobile.render(row);
  }
  if (col.render) {
    return col.render(row, 0);
  }
  return _getCellValue(row, col.key);
};

const getAlignClass = (align?: "left" | "center" | "right"): string => {
  if (align === "right") return "text-right";
  if (align === "center") return "text-center";
  return "text-left";
};

const getStickyClass = (sticky?: "left" | "right"): string => {
  if (sticky === "left") return "sticky left-0 z-10 bg-brand-white dark:bg-background-surface";
  if (sticky === "right") return "sticky right-0 z-10 bg-brand-white dark:bg-background-surface";
  return "";
};

const getStickyHeaderClass = (sticky?: "left" | "right"): string => {
  if (sticky === "left") return "sticky left-0 z-20 bg-table-header dark:bg-table-header";
  if (sticky === "right") return "sticky right-0 z-20 bg-table-header dark:bg-table-header";
  return "";
};

const renderActionButton = <T,>(
  icon: React.ReactElement,
  onClick: (row: T) => void,
  row: T,
  ariaLabel: string,
  title: string,
  className: string
): React.ReactElement => (
  <button
    onClick={(e: React.MouseEvent) => {
      e.stopPropagation();
      onClick(row);
    }}
    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${className}`}
    aria-label={ariaLabel}
    title={title}
  >
    {icon}
  </button>
);

const _renderDesktopBody = <T extends object,>(props: TableProps<T>): React.ReactElement => {
  const { data, columns, keyExtractor, onRowClick, isLoading, emptyText } = props;

  if (isLoading) {
    return (
      <>
        <tr>
          <td colSpan={columns.length} className="px-4 py-8 text-center text-text-tertiary font-medium">
            Loading...
          </td>
        </tr>
      </>
    );
  }

  if (data.length === 0) {
    return (
      <>
        <tr>
          <td colSpan={columns.length} className="px-4 py-8 text-center text-text-tertiary font-medium">
            {emptyText ?? "No data available"}
          </td>
        </tr>
      </>
    );
  }

  return (
    <>
      {data.map((row, index) => (
        <tr
          key={keyExtractor(row)}
          onClick={() => onRowClick?.(row)}
          className={`hover:bg-background-subtle/50 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
        >
          {columns.map((col) => (
            <td
              key={col.key}
              className={`px-4 py-3 border-b border-border-default ${getAlignClass(col.align)} ${getStickyClass(col.sticky)}`}
            >
              {_renderCellContent(col, row, index)}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

const _renderDesktopTable = <T extends object,>(props: TableProps<T>): React.ReactElement => {
  const { columns } = props;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-max whitespace-nowrap">
        <thead>
          <tr className="bg-table-header border-b border-border-default">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider ${getAlignClass(col.align)} ${getStickyHeaderClass(col.sticky)}`}
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-default">
          {_renderDesktopBody(props)}
        </tbody>
      </table>
    </div>
  );
};

const _renderMobileCard = <T extends object,>(props: TableProps<T>): React.ReactElement => {
  const { data, columns, keyExtractor, onRowClick, emptyText, isLoading } = props;
  const primaryColumns = columns.filter((col) => col.mobile?.primary);

  if (isLoading) {
    return (
      <div className="py-12 text-center text-base text-text-tertiary font-medium">
        Loading...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-base text-text-tertiary font-medium">
        {emptyText ?? "No data available"}
      </div>
    );
  }

  return (
    <div className="bg-background-surface overflow-hidden divide-y divide-border-default">
      {data.map((row) => (
        <div
          key={keyExtractor(row)}
          onClick={() => onRowClick?.(row)}
          onKeyDown={(e: React.KeyboardEvent) => {
            if ((e.key === "Enter" || e.key === " ") && onRowClick) {
              e.preventDefault();
              onRowClick(row);
            }
          }}
          className="flex flex-col gap-3 px-4 py-4 bg-transparent cursor-pointer active:bg-background-subtle/50 transition-colors"
          role={onRowClick ? "button" : undefined}
          tabIndex={onRowClick ? 0 : undefined}
        >
          {primaryColumns.map((col) => (
            <div
              key={col.key}
              className="flex items-center justify-between gap-2"
              onClick={(e) => {
                if (col.actions?.view || col.actions?.edit || col.actions?.delete) {
                  e.stopPropagation();
                }
              }}
            >
              <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
                {col.header}
              </span>
              <span
                className="flex-1 text-sm font-medium text-text-primary text-right truncate"
              >
                {_renderMobileCellContent(col, row)}
              </span>
            </div>
          ))}
          {columns.some((col) => col.actions?.view || col.actions?.edit || col.actions?.delete) && (
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-default">
              {columns.map((col) => (
                col.actions?.view && (
                  <button
                    key={`${col.key}-view`}
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      col.actions?.view?.(row);
                    }}
                    className="p-2 text-text-tertiary hover:text-action-primary hover:bg-action-primary-subtle rounded-lg transition-colors cursor-pointer"
                    aria-label="View"
                    title="View"
                  >
                    <FiEye className="w-5 h-5" />
                  </button>
                )
              ))}
              {columns.map((col) => (
                col.actions?.edit && (
                  <button
                    key={`${col.key}-edit`}
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      col.actions?.edit?.(row);
                    }}
                    className="p-2 text-text-tertiary hover:text-action-primary hover:bg-action-primary-subtle rounded-lg transition-colors cursor-pointer"
                    aria-label="Edit"
                    title="Edit"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                )
              ))}
              {columns.map((col) => (
                col.actions?.delete && (
                  <button
                    key={`${col.key}-delete`}
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      col.actions?.delete?.(row);
                    }}
                    className="p-2 text-text-tertiary hover:text-danger hover:bg-danger-subtle rounded-lg transition-colors cursor-pointer"
                    aria-label="Delete"
                    title="Delete"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                )
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const _renderPagination = <T extends object,>(props: TableProps<T>): React.ReactElement | null => {
  const {
    currentPage,
    totalPages,
    pageSize,
    totalCount,
    onPageChange,
    onPageSizeChange,
  } = props;

  if (currentPage === undefined || totalPages === undefined || pageSize === undefined || totalCount === undefined) {
    return null;
  }

  if (totalPages <= 1 && !onPageSizeChange) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border-default">
      <div className="flex items-center gap-3 text-sm text-text-tertiary">
        <span>Showing</span>
        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border border-border-default rounded px-2 py-1 bg-background-surface font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-action-primary"
          >
            {DEFAULT_PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        )}
        {!onPageSizeChange && <span className="font-medium text-text-primary">{pageSize}</span>}
        <span>of {totalCount} results</span>
      </div>
      <div className="flex items-center justify-center gap-1.5 text-sm text-text-tertiary font-medium">
        <button
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-1.5 rounded transition-colors ${
            currentPage === 1
              ? "text-text-disabled cursor-not-allowed"
              : "text-text-tertiary hover:text-text-primary hover:bg-background-subtle"
          }`}
          aria-label="Previous page"
        >
          {"<"}
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange?.(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
              currentPage === page
                ? "bg-action-primary text-text-inverse font-bold"
                : "hover:bg-background-subtle text-text-primary"
            }`}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-1.5 rounded transition-colors ${
            currentPage === totalPages
              ? "text-text-disabled cursor-not-allowed"
              : "text-text-tertiary hover:text-text-primary hover:bg-background-subtle"
          }`}
          aria-label="Next page"
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

/**
 * Render Table Component
 * @param {TableProps<T>} props - table component props
 * @returns {React.ReactElement} element
 */
export const TableComponent = <T extends object,>(props: TableProps<T>): React.ReactElement => {
  return (
    <div className="flex flex-col bg-background-surface rounded-xl border border-border-default shadow-sm overflow-hidden">
      <div className="hidden md:flex flex-1 overflow-auto">
        {_renderDesktopTable(props)}
      </div>
      <div className="md:hidden">
        {_renderMobileCard(props)}
      </div>
      {_renderPagination(props)}
    </div>
  );
};
