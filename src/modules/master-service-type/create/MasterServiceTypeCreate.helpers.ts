import { NON_DIGIT_PATTERN } from "@/constant/regex.const";

/**
 * Remove non-digit characters from Rupiah input.
 * @param {string} value - Input value
 * @returns {string} Digits only
 */
export const parseRupiahInput = (value: string): string => value.replace(NON_DIGIT_PATTERN, "");

/**
 * Format digits as Rupiah display text.
 * @param {string} value - Numeric string
 * @returns {string} Formatted Rupiah value
 */
export const formatRupiahInput = (value: string): string => {
  if (!value) {
    return "";
  }

  return `Rp ${Number(value).toLocaleString("id-ID")}`;
};

/**
 * Format backend messages into a display string.
 * @param {string[] | string | null} messages - Backend response messages
 * @returns {string} Display message
 */
export const formatServiceTypeMessages = (messages: string[] | string | null): string => {
  if (Array.isArray(messages)) {
    return messages.join(" ");
  }

  return messages ?? "Failed to save service type.";
};

/**
 * Resolve status code for payload.
 * @param {boolean} isEditMode - Edit mode flag
 * @param {boolean} isActive - Active switch status
 * @returns {number} Status code
 */
export const resolveServiceTypeStatus = (isEditMode: boolean, isActive: boolean): number => {
  if (!isEditMode) {
    return 1;
  }

  return isActive ? 1 : 0;
};
