import { describe, expect, it } from "@jest/globals";

import { formatPaymentPaidAt, formatRupiahInput, parseRupiahInput, validateRequiredPaymentFields } from "./PaymentCreate.helpers";

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

  it("should format date string into MM-DD-YYYY 00:00:00 for payment payload", (): void => {
    expect(formatPaymentPaidAt("2026-10-28")).toBe("10-28-2026 00:00:00");
    expect(formatPaymentPaidAt("2026-10-28T14:30:00.000Z")).toBe("10-28-2026 00:00:00");
    expect(formatPaymentPaidAt("2026-05-09")).toBe("05-09-2026 00:00:00");
    expect(formatPaymentPaidAt("11-03-2026")).toBe("11-03-2026 00:00:00");
    expect(formatPaymentPaidAt("")).toBe("");
  });
});
