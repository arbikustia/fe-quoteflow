import type { ReactElement } from "react";
import { FiEdit2 } from "react-icons/fi";

import { formatIndonesianDateTime } from "@/utils/date.helpers";

import type { TableColumn } from "@/components/Table";

import { RETURN_SKELETON_ROW_COUNT, RETURN_SKELETON_WIDTHS, RETURN_STATUS_CLASS, RETURN_STATUS_LABEL } from "./ItemReturn.config";
import type { ItemReturnMobileCardProps, ReturnListState, ReturnRow } from "./ItemReturn.type";
import { createEditClickHandler, getReturnRemark, getReturnRowNumber } from "./ItemReturn.util";

/**
 * Render return status badge.
 * @param {ReturnRow} row - Return row data
 * @returns {ReactElement} Badge element
 */
export const renderReturnStatus = (row: ReturnRow): ReactElement => (
  <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${RETURN_STATUS_CLASS[row.status]}`}>
    {RETURN_STATUS_LABEL[row.status]}
  </span>
);

/**
 * Render customer name cell.
 * @param {ReturnRow} row - Return row
 * @returns {ReactElement} Cell
 */
const _renderCustomerCell = (row: ReturnRow): ReactElement => <span className="text-lg font-medium">{row.customerName}</span>;

/**
 * Render return date cell.
 * @param {ReturnRow} row - Return row
 * @returns {ReactElement} Cell
 */
const _renderDateCell = (row: ReturnRow): ReactElement => (
  <span className="text-lg text-text-secondary">{formatIndonesianDateTime(row.returnDate)}</span>
);

/**
 * Render item count cell.
 * @param {ReturnRow} row - Return row
 * @returns {ReactElement} Cell
 */
const _renderCountCell = (row: ReturnRow): ReactElement => <span className="text-lg">{row.itemCount} items</span>;

/**
 * Render notes cell.
 * @param {ReturnRow} row - Return row
 * @returns {ReactElement} Cell
 */
const _renderNotesCell = (row: ReturnRow): ReactElement => <span className="text-lg">{row.notes}</span>;

/**
 * Render edit action cell.
 * @param {ReturnRow} row - Return row
 * @param {(row: ReturnRow) => void} onEdit - Edit callback
 * @returns {ReactElement} Cell
 */
const _renderActionCell = (row: ReturnRow, onEdit: (row: ReturnRow) => void): ReactElement => (
  <div className="flex items-center justify-center gap-1">
    <button
      type="button"
      onClick={createEditClickHandler(row, onEdit)}
      className="cursor-pointer rounded-3xl p-2.5 text-text-secondary hover:bg-action-primary-subtle hover:text-action-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
      title={`Edit ${row.customerName}`}
      aria-label={`Edit ${row.customerName}`}
    >
      <FiEdit2 className="h-5 w-5" aria-hidden="true" />
    </button>
  </div>
);

/**
 * Build table columns for item returns.
 * @param {ReturnListState} props - List properties
 * @returns {TableColumn<ReturnRow>[]} Column definitions
 */
export const getReturnColumns = (props: ReturnListState): TableColumn<ReturnRow>[] => {
  /**
   * Render row number cell.
   * @param {ReturnRow} _row - Return row
   * @param {number} index - Zero-based row index
   * @returns {ReactElement} Cell
   */
  const renderNumberCell = (_row: ReturnRow, index: number): ReactElement => (
    <span className="text-lg">{getReturnRowNumber(props.currentPage, props.pageSize, index)}</span>
  );

  /**
   * Render action cell.
   * @param {ReturnRow} row - Return row
   * @returns {ReactElement} Cell
   */
  const renderActionCell = (row: ReturnRow): ReactElement => _renderActionCell(row, props.onEdit);

  return [
    { key: "no", header: "No", align: "center", render: renderNumberCell },
    { key: "customerName", header: "Customer Name", render: _renderCustomerCell },
    { key: "returnDate", header: "Return Date", render: _renderDateCell },
    { key: "itemCount", header: "Items", align: "center", render: _renderCountCell },
    { key: "notes", header: "Notes", render: _renderNotesCell },
    { key: "status", header: "Status", align: "center", render: renderReturnStatus },
    { key: "actions", header: "Action", align: "center", render: renderActionCell },
  ];
};

/**
 * Render mobile return card.
 * @param {ItemReturnMobileCardProps} props - Card properties
 * @returns {ReactElement} Mobile card element
 */
export const ItemReturnMobileCard = ({ row, onClick }: ItemReturnMobileCardProps): ReactElement => {
  /**
   * Open the return row.
   * @returns {void} Nothing
   */
  const handleClick = (): void => onClick(row);

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary"
    >
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 break-words text-xl font-semibold text-text-primary">{row.customerName}</span>
        {renderReturnStatus(row)}
      </span>
      <span className="mt-4 block break-words text-lg text-text-secondary">{getReturnRemark(row)}</span>
      <span className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
        <span className="min-w-0 text-lg text-text-secondary">
          <span className="block text-lg text-text-tertiary">Return date</span>
          <span className="mt-1 block break-words text-lg font-medium text-text-primary">{formatIndonesianDateTime(row.returnDate)}</span>
        </span>
        <span className="text-right tabular-nums">
          <span className="block text-lg text-text-tertiary">Total Items</span>
          <span className="mt-1 block text-xl font-semibold text-text-primary">{row.itemCount} items</span>
        </span>
      </span>
    </button>
  );
};

/**
 * Render mobile card skeleton matching return card.
 * @param {number} key - Unique key
 * @returns {ReactElement} Skeleton card element
 */
export const renderMobileCardSkeleton = (key: number): ReactElement => (
  <div key={key} className="animate-pulse rounded-3xl border border-border-strong bg-background-surface p-5 shadow-small" role="status" aria-label="Loading item return card">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="h-7 w-28 rounded-3xl bg-background-subtle" />
      <div className="h-8 w-24 rounded-full bg-background-subtle" />
    </div>
    <div className="mt-4 h-7 w-4/5 rounded-3xl bg-background-subtle" />
    <div className="mt-1.5 h-7 w-3/5 rounded-3xl bg-background-subtle" />
    <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4">
      <div className="min-w-0">
        <div className="h-7 w-20 rounded-3xl bg-background-subtle" />
        <div className="mt-1 h-7 w-36 rounded-3xl bg-background-subtle" />
      </div>
      <div className="text-right">
        <div className="ml-auto h-7 w-12 rounded-3xl bg-background-subtle" />
        <div className="mt-1 h-7 w-20 rounded-3xl bg-background-subtle" />
      </div>
    </div>
  </div>
);

/**
 * Get text alignment class of a column.
 * @param {TableColumn<ReturnRow>} column - Column
 * @returns {string} Alignment class
 */
const _getAlignClass = (column: TableColumn<ReturnRow>): string => (column.align === "center" ? "text-center" : "text-left");

/**
 * Render skeleton header cell.
 * @param {TableColumn<ReturnRow>} column - Column
 * @param {number} index - Column index
 * @param {number} count - Column count
 * @returns {ReactElement} Header cell
 */
const _renderSkeletonHeader = (column: TableColumn<ReturnRow>, index: number, count: number): ReactElement => (
  <th
    key={column.key}
    className={`bg-table-header px-5 py-4 text-[13px] font-bold uppercase tracking-widest text-text-secondary ${_getAlignClass(column)} ${index === 0 ? "rounded-l-3xl" : ""} ${index === count - 1 ? "rounded-r-3xl" : ""}`}
  >
    {column.header}
  </th>
);

/**
 * Render skeleton body cell.
 * @param {TableColumn<ReturnRow>} column - Column
 * @param {number} index - Column index
 * @returns {ReactElement} Body cell
 */
const _renderSkeletonCell = (column: TableColumn<ReturnRow>, index: number): ReactElement => {
  if (column.key === "actions") {
    return (
      <td key={column.key} className={`border-b border-border-default px-5 py-4 ${_getAlignClass(column)}`}>
        <div className="flex justify-center gap-1"><span className="h-10 w-10 rounded-3xl bg-background-subtle" /></div>
      </td>
    );
  }

  const widthClass = column.key === "status" ? "w-28 rounded-full" : (RETURN_SKELETON_WIDTHS[index] ?? "w-16");

  return (
    <td key={column.key} className={`border-b border-border-default px-5 py-4 ${_getAlignClass(column)}`}>
      <span className={`inline-block h-5 rounded-3xl bg-background-subtle align-middle ${widthClass}`} />
    </td>
  );
};

/**
 * Render table skeleton for item return.
 * @param {TableColumn<ReturnRow>[]} columns - Columns
 * @returns {ReactElement} Skeleton table
 */
export const renderTableSkeleton = (columns: TableColumn<ReturnRow>[]): ReactElement => (
  <div className="w-full overflow-x-auto" role="status" aria-label="Loading item return table">
    <table className="w-full min-w-max border-separate border-spacing-0 whitespace-nowrap">
      <thead>
        <tr>{columns.map((column, index) => _renderSkeletonHeader(column, index, columns.length))}</tr>
      </thead>
      <tbody>
        {Array.from({ length: RETURN_SKELETON_ROW_COUNT }, (_value, rowIndex) => (
          <tr key={rowIndex} className="animate-pulse">{columns.map(_renderSkeletonCell)}</tr>
        ))}
      </tbody>
    </table>
  </div>
);

/**
 * Render list error or empty state.
 * @param {ReturnListState} props - List properties
 * @returns {ReactElement | null} State element
 */
export const renderListState = (props: ReturnListState): ReactElement | null => {
  if (props.errorMessage) {
    return <p role="alert" className="py-10 text-center text-lg text-danger">{props.errorMessage}</p>;
  }

  if (props.isEmpty) {
    return <p className="py-10 text-center text-lg text-text-secondary">No item returns found.</p>;
  }

  return null;
};
