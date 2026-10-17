import type { RequiredItemFields } from "../MasterItem.type";

import { NON_DIGIT_PATTERN } from "@/constant/regex.const";

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

  return `Rp ${Number(value).toLocaleString("id-ID")}`;
};

/**
 * Validate required item fields (all required except remark and image).
 * @param {RequiredItemFields} fields - Field values to validate
 * @returns {string | null} Error message or null
 */
export const validateRequiredItemFields = (fields: RequiredItemFields): string | null => {
  if (!fields.name.trim()) return "Item name is required.";

  if (!fields.categoryId.trim()) return "Category is required.";

  if (!fields.price.trim()) return "Price is required.";

  if (!fields.stock.trim()) return "Stock is required.";

  if (!fields.duration.trim()) return "Duration is required.";

  return null;
};
