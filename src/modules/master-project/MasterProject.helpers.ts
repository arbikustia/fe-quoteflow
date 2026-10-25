/**
 * Calculate project table row number.
 * @param {number} currentPage - Active page
 * @param {number} pageSize - Active page size
 * @param {number} rowIndex - Zero-based row index
 * @returns {number} Display row number
 */
export const getProjectRowNumber = (currentPage: number, pageSize: number, rowIndex: number): number => (currentPage - 1) * pageSize + rowIndex + 1;
