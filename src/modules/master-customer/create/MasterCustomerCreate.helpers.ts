const NON_DIGIT_PATTERN = /\D/g;

/**
 * Filter phone input value to keep numbers only.
 * @param {string} value - Raw input value
 * @returns {string} Number-only value
 */
export const parsePhoneInput = (value: string): string => value.replace(NON_DIGIT_PATTERN, "");
