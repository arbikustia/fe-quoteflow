/**
 * Format an amount as Rupiah.
 * @param {number} [amount] - Amount, 0 when omitted
 * @returns {string} - Formatted Rupiah amount
 */
export const formatCurrency = (amount?: number): string => `Rp ${(amount ?? 0).toLocaleString("id-ID")}`;

/**
 * Format percentage discount as Rupiah amount and percentage.
 * @param {number} subtotal - Transaction subtotal
 * @param {number} discountPercent - Discount percentage
 * @returns {string} Formatted discount amount and percentage
 */
export const formatDiscount = (subtotal: number, discountPercent: number): string =>
  `${formatCurrency(Math.round(subtotal * discountPercent / 100))} (${discountPercent}%)`;

/**
 * Format a date for display; empty gives a dash, invalid is returned as is.
 * @param {string} dateString - Date string
 * @returns {string} - Formatted date
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) {
    return "-";
  }

  const date = new Date(dateString);

  return Number.isNaN(date.getTime()) ? dateString : date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/**
 * Get the active/inactive label of a master record.
 * @param {number} status - Status value
 * @returns {string} - Status label
 */
export const getStatusLabel = (status: number): string => (status === 1 ? "Active" : "Inactive");

/**
 * Get quotation workflow status label.
 * @param {number} status - Quotation status value
 * @returns {string} Quotation workflow status label
 */
export const getQuotationStatusLabel = (status: number): string => {
  if (status === 1) return "Quotation Created";

  if (status === 2) return "Approved";

  if (status === 0) return "Cancelled";

  return "-";
};

/**
 * Get invoice workflow status label.
 * @param {number} status - Invoice status value
 * @returns {string} Invoice workflow status label
 */
export const getInvoiceStatusLabel = (status: number): string => {
  if (status === 1) return "Invoice Created";

  if (status === 2) return "Approved";

  if (status === 0) return "Cancelled";

  return "-";
};

/**
 * Get workflow status badge CSS class.
 * @param {number} status - Status value
 * @returns {string} Badge CSS class
 */
export const getStatusBadgeClass = (status: number): string => {
  if (status === 2) return "bg-success-subtle text-success-strong";

  if (status === 1) return "bg-warning-subtle text-warning-strong";

  if (status === 0) return "bg-danger-subtle text-danger-strong";

  return "bg-background-muted text-text-tertiary";
};
