/**
 * Resolve the error message of the order detail query.
 * @param {boolean} hasError - Whether the query failed
 * @param {boolean} [status] - Status flag of the response
 * @returns {string | null} - Error message, or null when there is none
 */
export const resolveOrderDetailError = (hasError: boolean, status?: boolean): string | null => {
  if (hasError) {
    return "Unable to load order detail.";
  }

  if (status === false) {
    return "Order detail is unavailable.";
  }

  return null;
};
