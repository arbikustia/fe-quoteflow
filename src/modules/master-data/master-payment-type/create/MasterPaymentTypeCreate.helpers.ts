/**
 * Validate required payment type fields.
 * @param {string} name - Payment type name
 * @returns {string | null} Validation error
 */
export const validatePaymentTypeFields = (name: string): string | null => {
  if (!name.trim()) {
    return "Payment type name is required.";
  }

  return null;
};

