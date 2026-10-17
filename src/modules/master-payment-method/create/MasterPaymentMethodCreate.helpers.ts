/**
 * Validate required payment method fields.
 * @param {string} name - Payment method name
 * @param {string} description - Payment method description
 * @returns {string | null} Validation error
 */
export const validatePaymentMethodFields = (name: string, description: string): string | null => {
  if (!name.trim()) return "Payment method name is required.";
  if (!description.trim()) return "Description is required.";

  return null;
};
