/**
 * Remove non-digit characters from Rupiah input.
 * @param {string} value - Input value
 * @returns {string} Digits only
 */
export const parseRupiahInput = (value: string): string => value.replace(/[^0-9]/g, "");

/**
 * Format digits as Rupiah display text.
 * @param {string} value - Numeric string
 * @returns {string} Formatted Rupiah value
 */
export const formatRupiahInput = (value: string): string => {
  if (!value) {
    return "";
  }

  return `Rp ${value.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
};
