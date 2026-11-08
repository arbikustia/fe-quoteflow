/**
 * Clean and format order type name input.
 *
 * @param {string} value - Raw input value
 * @returns {string} Trimmed name
 */
export const formatOrderTypeName = (value: string): string => value.trimStart();
