import { describe, expect, it } from "@jest/globals";

import type { ApiInvoice } from "@/modules/invoice/Invoice.type";
import type { MailComposeValues } from "@/modules/mail/create/MailCreate.type";
import type { ApiQuotation } from "@/modules/quotation/Quotation.type";
import { buildMailHtmlTemplate, buildMailSendFormData } from "@/services/mail/mail.service";

describe("buildMailHtmlTemplate", () => {
  it("should render the quotation template with the default copy", () => {
    const html = buildMailHtmlTemplate("Hello team");

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("Hello team");
    expect(html).toContain("Penawaran Harga");
    expect(html).toContain(">Quotation<");
  });

  it("should switch the header to invoice", () => {
    const html = buildMailHtmlTemplate("Hello team", "invoice");

    expect(html).toContain(">Invoice<");
    expect(html).not.toContain(">Quotation<");
  });

  it("should not hardcode any copy in the body area", () => {
    const html = buildMailHtmlTemplate("");

    expect(html).not.toContain("Yth.");
    expect(html).not.toContain("Hormat kami");
    expect(html).not.toContain("Tim Kami");
  });

  it("should keep the rich text formatting and strip unsafe markup", () => {
    const html = buildMailHtmlTemplate('<p><strong>Hello</strong></p><script>alert("x")</script>');

    expect(html).toContain("<strong>Hello</strong>");
    expect(html).not.toContain("<script>");
  });

  it("should render the logo mark in the header", () => {
    const html = buildMailHtmlTemplate("Hello team");

    expect(html).toContain("logo.png");
  });

  it("should use a neutral header so the brand logo keeps its contrast", () => {
    const html = buildMailHtmlTemplate("Hello team");

    expect(html).toContain("background-color:#6B7280");
    expect(html).not.toContain("#3F51B5");
    expect(html).not.toContain("#FF6E02");
  });

  it("should append the selected quotation transaction below the body", () => {
    const quotation = {
      id: "quotation-1",
      quotation_no: "QUO-001",
      quotation_date: "2026-11-07T00:00:00.000Z",
      transaction: {
        customer_name: "PT Example",
        event_name: "Wedding",
        start_at: "2026-11-08T00:00:00.000Z",
        end_at: "2026-11-09T00:00:00.000Z",
        grand_total: 1500000,
      },
    } as unknown as ApiQuotation;

    const html = buildMailHtmlTemplate("Hello team", "quotation", quotation);

    expect(html).toContain("Quotation No");
    expect(html).toContain("QUO-001");
    expect(html).toContain("PT Example");
    expect(html).toContain("Rp 1.500.000");
  });

  it("should append the selected invoice transaction below the body", () => {
    const invoice = {
      id: "invoice-1",
      invoice_no: "INV-001",
      invoice_date: "2026-11-07T00:00:00.000Z",
      due_date: "2026-11-10T00:00:00.000Z",
      quotation: {
        transaction: { customer_name: "PT Example", event_name: "Wedding", grand_total: 2000000 },
      },
    } as unknown as ApiInvoice;

    const html = buildMailHtmlTemplate("Hello team", "invoice", undefined, invoice);

    expect(html).toContain("Invoice No");
    expect(html).toContain("INV-001");
    expect(html).toContain("Due Date");
    expect(html).toContain("Rp 2.000.000");
  });
});

const BASE_VALUES: MailComposeValues = {
  senderId: "sales@example.com",
  template: "quotation",
  to: "customer@example.com",
  subject: "Follow up",
  body: "Hello",
};

describe("buildMailSendFormData", () => {
  it("should append required multipart fields with the html body", () => {
    const formData = buildMailSendFormData({ ...BASE_VALUES });

    expect(formData.get("senderId")).toBe("sales@example.com");
    expect(formData.get("to")).toBe("customer@example.com");
    expect(formData.get("subject")).toBe("Follow up");
    expect(formData.get("body")).toBe(buildMailHtmlTemplate("Hello"));
    expect(formData.get("isHtml")).toBe("true");
    expect(formData.get("attachments")).toBeNull();
  });

  it("should render the selected template in the body", () => {
    const formData = buildMailSendFormData({ ...BASE_VALUES, template: "invoice" });

    expect(formData.get("body")).toContain(">Invoice<");
  });

  it("should append the pdf attachment when provided", () => {
    const file = new File(["pdf"], "quotation.pdf", { type: "application/pdf" });
    const formData = buildMailSendFormData({ ...BASE_VALUES, attachment: file });

    expect(formData.get("attachments")).toBeInstanceOf(File);
    expect((formData.get("attachments") as File).name).toBe("quotation.pdf");
  });
});
