/**
 * Validate required PIC fields.
 * @param {string} name - PIC name
 * @returns {string | null} Validation error
 */
export const validatePicFields = (name: string): string | null => {
  if (!name.trim()) {
    return "PIC name is required.";
  }

  return null;
};
