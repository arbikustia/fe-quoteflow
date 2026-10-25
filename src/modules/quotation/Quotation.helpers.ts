/**
 * Calculate pure 1-based display row index.
 * @param {number} currentPage - Current page number
 * @param {number} pageSize - Number of rows per page
 * @param {number} index - 0-based index of item on current page
 * @returns {number} 1-based overall row number
 */
export const getQuotationRowNumber = (
  currentPage: number,
  pageSize: number,
  index: number,
): number => (currentPage - 1) * pageSize + index + 1;
