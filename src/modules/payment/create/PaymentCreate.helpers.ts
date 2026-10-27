import type { PaymentRequiredFields } from "../Payment.type";

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
  if (!value) {
    return "";
  }

  return `Rp ${Number(value).toLocaleString("id-ID")}`;
};

/**
 * Validate payment required fields.
 * @param {PaymentRequiredFields} fields - Payment field values
 * @returns {string | null} Error message or null
 */
export const validateRequiredPaymentFields = (fields: PaymentRequiredFields): string | null => {
  if (!fields.invoiceId) return "Invoice is required.";

  if (!fields.paymentMethodId) return "Payment method is required.";

  if (!fields.amount || fields.amount <= 0) return "Amount must be greater than Rp 0.";

  if (!fields.paidAt) return "Paid at is required.";

  return null;
};
