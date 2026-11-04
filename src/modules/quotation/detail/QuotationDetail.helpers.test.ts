import { describe, expect, it } from "@jest/globals";

import {
  formatDiscount,
  getInvoiceStatusLabel,
  getQuotationStatusLabel,
  getStatusBadgeClass,
} from "./QuotationDetail.helpers";

describe("QuotationDetail helpers status mapping", () => {
  it("should format percentage discount as Rupiah amount", (): void => {
    expect(formatDiscount(625000, 8)).toBe("Rp 50.000 (8%)");
  });

  it("should return correct label for quotation status", (): void => {
    expect(getQuotationStatusLabel(1)).toBe("Quotation Created");
    expect(getQuotationStatusLabel(2)).toBe("Approved");
    expect(getQuotationStatusLabel(0)).toBe("Cancelled");
    expect(getQuotationStatusLabel(99)).toBe("-");
  });

  it("should return correct label for invoice status", (): void => {
    expect(getInvoiceStatusLabel(1)).toBe("Invoice Created");
    expect(getInvoiceStatusLabel(2)).toBe("Approved");
    expect(getInvoiceStatusLabel(0)).toBe("Cancelled");
    expect(getInvoiceStatusLabel(99)).toBe("-");
  });

  it("should return correct badge styling class by status", (): void => {
    expect(getStatusBadgeClass(2)).toBe("bg-success-subtle text-success-strong");
    expect(getStatusBadgeClass(1)).toBe("bg-warning-subtle text-warning-strong");
    expect(getStatusBadgeClass(0)).toBe("bg-danger-subtle text-danger-strong");
    expect(getStatusBadgeClass(99)).toBe("bg-background-muted text-text-tertiary");
  });
});
