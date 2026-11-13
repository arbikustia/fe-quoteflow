/**
 * Format a display value without changing source data.
 * @param {string} value - Source display value
 * @returns {string} - Display value
 */
export const formatMailDisplayValue = (value: string): string => value || "—";

/**
 * Calculate mail table row number.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} rowIndex - Zero-based row index
 * @returns {number} - Display row number
 */
export const getMailRowNumber = (currentPage: number, pageSize: number, rowIndex: number): number => (currentPage - 1) * pageSize + rowIndex + 1;
