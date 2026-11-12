import { NON_DIGIT_PATTERN } from "@/constants/regex.constant";

import type { ApiPaymentSummary, PaymentAmountLimit, PaymentInvoiceOption, PaymentRequiredFields } from "../Payment.type";

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
 * Get the grand total of the transaction linked to an invoice.
 * @param {PaymentInvoiceOption | null | undefined} invoice - Selected invoice
 * @returns {number | null} Grand total, or null when unavailable
 */
export const getInvoiceGrandTotal = (invoice?: PaymentInvoiceOption | null): number | null => {
  const grandTotal = invoice?.quotation?.transaction?.grand_total;

  return typeof grandTotal === "number" ? grandTotal : null;
};

/**
 * Get the remaining amount of an invoice from its payment summaries.
 * @param {ApiPaymentSummary[]} summaries - Payment summaries returned for the invoice search
 * @param {string} invoiceId - Selected invoice ID
 * @returns {number | null} Remaining amount, or null when unavailable
 */
export const getInvoiceRemainingAmount = (summaries: ApiPaymentSummary[], invoiceId: string): number | null => {
  const summary = summaries.find((item) => item.invoice_id === invoiceId);

  return typeof summary?.remaining_amount === "number" ? summary.remaining_amount : null;
};

/**
 * Resolve the maximum payment amount: the remaining amount when known, otherwise the grand total.
 * @param {number | null} remainingAmount - Invoice remaining amount
 * @param {number | null} grandTotal - Transaction grand total
 * @returns {PaymentAmountLimit | null} Amount limit, or null when no limit is known
 */
export const getPaymentAmountLimit = (remainingAmount: number | null, grandTotal: number | null): PaymentAmountLimit | null => {
  if (remainingAmount !== null) return { value: remainingAmount, label: "remaining amount" };

  if (grandTotal !== null) return { value: grandTotal, label: "grand total" };

  return null;
};

/**
 * Build the error message when amount exceeds the allowed maximum.
 * @param {number | null} amount - Payment amount
 * @param {PaymentAmountLimit | null} [limit] - Maximum allowed amount
 * @returns {string | null} Error message or null
 */
export const getAmountLimitMessage = (amount: number | null, limit?: PaymentAmountLimit | null): string | null => {
  if (amount === null || !limit || amount <= limit.value) return null;

  return `Amount cannot be higher than ${limit.label} (${formatRupiahInput(String(limit.value)) || "Rp 0"}).`;
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

  const amountLimitMessage = getAmountLimitMessage(fields.amount, fields.amountLimit);

  if (amountLimitMessage) return amountLimitMessage;

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
