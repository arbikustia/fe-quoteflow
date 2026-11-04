import type { PaymentRequiredFields } from "../Payment.type";

import { NON_DIGIT_PATTERN } from "@/constant/regex.const";

export const PAYMENT_STATUS_OPTIONS = [
  { value: "1", label: "DP" },
  { value: "2", label: "Partial" },
  { value: "3", label: "Pelunasan" },
];

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

  if (!fields.status) return "Payment status is required.";

  if (!fields.amount || fields.amount <= 0) return "Amount must be greater than Rp 0.";

  if (!fields.paidAt) return "Paid at is required.";

  return null;
};

/**
 * Format date string into MM-DD-YYYY 00:00:00 for payment payload.
 * @param {string} value - Date string
 * @returns {string} MM-DD-YYYY 00:00:00 formatted string
 */
export const formatPaymentPaidAt = (value: string): string => {
  if (!value) {
    return "";
  }

  const datePart = value.split("T")[0].split(" ")[0];
  const parts = datePart.split("-");

  if (parts.length === 3) {
    if (parts[0].length === 4) {
      const [year, month, day] = parts;

      return `${month.padStart(2, "0")}-${day.padStart(2, "0")}-${year} 00:00:00`;
    }

    if (parts[2].length === 4) {
      return `${datePart} 00:00:00`;
    }
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}-${day}-${year} 00:00:00`;
};
