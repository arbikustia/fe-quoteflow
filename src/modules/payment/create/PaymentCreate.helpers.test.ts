import { describe, expect, it } from "@jest/globals";

import { formatPaymentPaidAt, formatRupiahInput, getAmountLimitMessage, getInvoiceGrandTotal, getInvoiceRemainingAmount, getPaymentAmountLimit, parseRupiahInput, validateRequiredPaymentFields } from "./PaymentCreate.helpers";

const validFields = {
  invoiceId: "invoice-1",
  paymentMethodId: "method-1",
  status: "1",
  amount: 1500000,
  paidAt: "2026-10-28",
  referenceNo: "PAY-001",
};

describe("PaymentCreate helpers", () => {
  it("should format and parse Rupiah input", (): void => {
    expect(formatRupiahInput("1500000")).toBe("Rp 1.500.000");
    expect(parseRupiahInput("Rp 1.500.000")).toBe("1500000");
  });

  it("should validate each required payment field", (): void => {
    expect(validateRequiredPaymentFields(validFields)).toBeNull();
    expect(validateRequiredPaymentFields({ ...validFields, invoiceId: "" })).toBe("Invoice is required.");
    expect(validateRequiredPaymentFields({ ...validFields, paymentMethodId: "" })).toBe("Payment method is required.");
    expect(validateRequiredPaymentFields({ ...validFields, status: "" })).toBe("Payment status is required.");
    expect(validateRequiredPaymentFields({ ...validFields, amount: 0 })).toBe("Amount must be greater than Rp 0.");
    expect(validateRequiredPaymentFields({ ...validFields, paidAt: "" })).toBe("Paid at is required.");
    expect(validateRequiredPaymentFields({ ...validFields, referenceNo: " " })).toBeNull();
  });

  it("should reject amount higher than the amount limit", (): void => {
    expect(validateRequiredPaymentFields({ ...validFields, amountLimit: { value: 1500000, label: "grand total" } })).toBeNull();
    expect(validateRequiredPaymentFields({ ...validFields, amountLimit: { value: 1000000, label: "grand total" } })).toBe("Amount cannot be higher than grand total (Rp 1.000.000).");
    expect(validateRequiredPaymentFields({ ...validFields, amountLimit: { value: 500000, label: "remaining amount" } })).toBe("Amount cannot be higher than remaining amount (Rp 500.000).");
    expect(validateRequiredPaymentFields({ ...validFields, amountLimit: null })).toBeNull();
    expect(getAmountLimitMessage(null, { value: 1000000, label: "grand total" })).toBeNull();
    expect(getAmountLimitMessage(1, { value: 0, label: "remaining amount" })).toBe("Amount cannot be higher than remaining amount (Rp 0).");
  });

  it("should prefer remaining amount over grand total as the amount limit", (): void => {
    expect(getPaymentAmountLimit(400000, 1000000)).toEqual({ value: 400000, label: "remaining amount" });
    expect(getPaymentAmountLimit(null, 1000000)).toEqual({ value: 1000000, label: "grand total" });
    expect(getPaymentAmountLimit(null, null)).toBeNull();
  });

  it("should read remaining amount of the selected invoice from payment summaries", (): void => {
    const summary = { invoice_id: "inv-1", invoice_no: "INV-001", customer_name: "PT Example", grand_total: 1000000, total_paid: 600000, remaining_amount: 400000, status: "Partial", payments: [] };

    expect(getInvoiceRemainingAmount([summary], "inv-1")).toBe(400000);
    expect(getInvoiceRemainingAmount([summary], "inv-2")).toBeNull();
    expect(getInvoiceRemainingAmount([], "inv-1")).toBeNull();
  });

  it("should read grand total from invoice transaction", (): void => {
    expect(getInvoiceGrandTotal({ id: "inv-1", invoice_no: "INV-001", quotation: { transaction: { grand_total: 2500000 } } })).toBe(2500000);
    expect(getInvoiceGrandTotal({ id: "inv-1", invoice_no: "INV-001" })).toBeNull();
    expect(getInvoiceGrandTotal(null)).toBeNull();
  });

  it("should format date string into MM-DD-YYYY 00:00:00 for payment payload", (): void => {
    expect(formatPaymentPaidAt("2026-10-28")).toBe("10-28-2026 00:00:00");
    expect(formatPaymentPaidAt("2026-10-28T14:30:00.000Z")).toBe("10-28-2026 00:00:00");
    expect(formatPaymentPaidAt("2026-05-09")).toBe("05-09-2026 00:00:00");
    expect(formatPaymentPaidAt("11-03-2026")).toBe("11-03-2026 00:00:00");
    expect(formatPaymentPaidAt("")).toBe("");
  });
});
