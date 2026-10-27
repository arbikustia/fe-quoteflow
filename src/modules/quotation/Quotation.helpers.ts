/**
 * getQuotationRowNumber.
 * @param {number} currentPage - currentPage value.
 * @param {number} pageSize - pageSize value.
 * @param {number} index - index value.
 * @returns {number} - result.
 */
export const getQuotationRowNumber = (
  currentPage: number,
  pageSize: number,
  index: number,
): number => (currentPage - 1) * pageSize + index + 1;
