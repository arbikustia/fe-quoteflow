const NON_DIGIT_PATTERN = /\D/g;
const THOUSANDS_PATTERN = /\B(?=(\d{3})+(?!\d))/g;

/**
 * Convert formatted Rupiah input into digit-only value.
 * @param {string} value - Formatted input value
 * @returns {string} Digit-only value
 */
export const parseRupiahInput = (value: string): string => value.replace(NON_DIGIT_PATTERN, "");

/**
 * Format digit-only value as Indonesian Rupiah.
 * @param {string} value - Digit-only value
 * @returns {string} Formatted Rupiah value
 */
export const formatRupiahInput = (value: string): string => {
  if (value === "") {
    return "";
  }

  return `Rp ${value.replace(THOUSANDS_PATTERN, ".")}`;
};

/**
 * Validate required item fields (all required except remark and image).
 * @param {object} fields - Field values to validate
 * @param {string} fields.name - Item name
 * @param {string} fields.categoryId - Category ID
 * @param {string} fields.price - Price string
 * @param {string} fields.stock - Stock string
 * @param {string} fields.duration - Duration string
 * @returns {string | null} Error message or null
 */
export const validateRequiredItemFields = (fields: {
  readonly name: string;
  readonly categoryId: string;
  readonly price: string;
  readonly stock: string;
  readonly duration: string;
}): string | null => {
  if (!fields.name.trim()) return "Item name is required.";
  if (!fields.categoryId.trim()) return "Category is required.";
  if (!fields.price.trim()) return "Price is required.";
  if (!fields.stock.trim()) return "Stock is required.";
  if (!fields.duration.trim()) return "Duration is required.";

  return null;
};
