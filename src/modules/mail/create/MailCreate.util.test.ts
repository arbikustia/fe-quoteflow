import { describe, expect, it } from "@jest/globals";

import { buildInvoiceOptions, buildQuotationOptions, formatSendMessages, getSelectedFile, isBlankBody, isPdfFile, validateMailValues } from "./MailCreate.util";

describe("validateMailValues", () => {
  it("should require every field", () => {
    const errors = validateMailValues({ senderId: "", to: "", subject: "", body: "" });

    expect(errors.senderError).toBeDefined();
    expect(errors.toError).toBeDefined();
    expect(errors.subjectError).toBeDefined();
    expect(errors.bodyError).toBeDefined();
  });

  it("should reject an invalid recipient address", () => {
    const errors = validateMailValues({ senderId: "s1", to: "not-an-email", subject: "Hi", body: "Body" });

    expect(errors.toError).toBe("Please enter a valid email address.");
  });

  it("should accept a complete payload", () => {
    const errors = validateMailValues({ senderId: "s1", to: "customer@example.com", subject: "Hi", body: "Body" });

    expect(Object.keys(errors)).toHaveLength(0);
  });
});

describe("MailCreate util helpers", () => {
  it("should detect blank rich text bodies", () => {
    expect(isBlankBody("<p>&nbsp;</p>")).toBe(true);
    expect(isBlankBody("<p>Hello</p>")).toBe(false);
  });

  it("should detect pdf files and read the selected file", () => {
    const pdf = new File(["x"], "a.pdf", { type: "application/pdf" });

    expect(isPdfFile(pdf)).toBe(true);
    expect(isPdfFile(new File(["x"], "a.txt", { type: "text/plain" }))).toBe(false);
    expect(getSelectedFile({ target: { files: [pdf] } } as never)).toBe(pdf);
  });

  it("should label quotation options with the customer when present", () => {
    const quotations = [
      { id: "q1", quotation_no: "QUO-1", transaction: { customer_name: "PT A" } },
      { id: "q2", quotation_no: "QUO-2" },
    ] as never;

    expect(buildQuotationOptions(quotations)).toEqual([
      { label: "QUO-1 - PT A", value: "q1" },
      { label: "QUO-2", value: "q2" },
    ]);
  });

  it("should label invoice options from customer or quotation customer", () => {
    const invoices = [
      { id: "i1", invoice_no: "INV-1", customer: { name: "PT B" } },
      { id: "i2", invoice_no: "INV-2", quotation: { transaction: { customer_name: "PT C" } } },
      { id: "i3", invoice_no: "INV-3" },
    ] as never;

    expect(buildInvoiceOptions(invoices).map((option) => option.label)).toEqual(["INV-1 - PT B", "INV-2 - PT C", "INV-3"]);
  });

  it("should format send messages with a default", () => {
    expect(formatSendMessages()).toBe("Unable to send mail. Please try again.");
    expect(formatSendMessages(["a", "b"])).toBe("a b");
    expect(formatSendMessages("single")).toBe("single");
  });
});
