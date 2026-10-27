import { describe, expect, it } from "@jest/globals";

import { formatRupiahInput, parseRupiahInput, validateRequiredPaymentFields } from "./PaymentCreate.helpers";

const validFields = {
  invoiceId: "invoice-1",
  paymentMethodId: "method-1",
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
    expect(validateRequiredPaymentFields({ ...validFields, amount: 0 })).toBe("Amount must be greater than Rp 0.");
    expect(validateRequiredPaymentFields({ ...validFields, paidAt: "" })).toBe("Paid at is required.");
    expect(validateRequiredPaymentFields({ ...validFields, referenceNo: " " })).toBeNull();
  });
});
