import type { MouseEvent } from "react";

import type { ApiReturn, ReturnRow, ReturnRowStatus } from "./ItemReturn.type";

/**
 * Resolve display status from API status code.
 * @param {number | null} status - API status code
 * @returns {ReturnRowStatus} Display status
 */
export const getReturnStatus = (status: number | null): ReturnRowStatus => {
  if (status === null) return "unavailable";

  return status === 1 ? "active" : "inactive";
};

/**
 * Map API return record into table/card display row.
 * @param {ApiReturn} item - API return item
 * @returns {ReturnRow} Display row
 */
export const mapReturn = (item: ApiReturn): ReturnRow => ({
  id: item.id,
  customerName: item.items[0]?.customer_name || "-",
  returnDate: item.return_date,
  itemCount: Array.isArray(item.items) ? item.items.length : 0,
  notes: item.notes || "-",
  status: getReturnStatus(item.status),
});

/**
 * Get the table row key of a return row.
 * @param {ReturnRow} row - Return row
 * @returns {string} Row key
 */
export const getReturnRowKey = (row: ReturnRow): string => row.id;

/**
 * Get the 1-based row number across pages.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} index - Zero-based row index
 * @returns {number} Row number
 */
export const getReturnRowNumber = (currentPage: number, pageSize: number, index: number): number =>
  (currentPage - 1) * pageSize + index + 1;

/**
 * Get the remark shown on a mobile card.
 * @param {ReturnRow} row - Return row
 * @returns {string} Remark or placeholder
 */
export const getReturnRemark = (row: ReturnRow): string => (row.notes && row.notes !== "-" ? row.notes : "No remark");

/**
 * Create an edit click handler that does not bubble up to the row click.
 * @param {ReturnRow} row - Row of the button
 * @param {(row: ReturnRow) => void} onEdit - Edit callback
 * @returns {(event: MouseEvent<HTMLButtonElement>) => void} Click handler
 */
export const createEditClickHandler = (
  row: ReturnRow,
  onEdit: (row: ReturnRow) => void,
): ((event: MouseEvent<HTMLButtonElement>) => void) =>
  (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    onEdit(row);
  };
