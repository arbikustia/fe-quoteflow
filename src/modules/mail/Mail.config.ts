import type { MailTemplate, MailTemplateContent } from "./Mail.type";

export const MAIL_CONFIG = {
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_TEMPLATE: "quotation" as MailTemplate,
  TEMPLATE_OPTIONS: [
    { label: "Quotation", value: "quotation" },
    { label: "Invoice", value: "invoice" },
  ],
  TEMPLATE_CONTENT: {
    quotation: {
      eyebrow: "Prepared for review",
      heading: "Congrats, your quotation has been",
      accent: "Ready",
      intro: "QuoteFlow has prepared this quotation for your review. You'll receive a confirmation once it's approved.",
      note: "We've put together a quotation that covers every item you asked about. Here's what's waiting for you:",
      closing: "Review the attached document, then reply to this email if you'd like any adjustment before we proceed.",
    },
    invoice: {
      eyebrow: "Payment summary",
      heading: "Congrats, your invoice has been",
      accent: "Confirmed",
      intro: "The QuoteFlow team has processed this invoice. Keep this email as your payment record.",
      note: "We've put together an invoice that covers every item in this order. Here's what's waiting for you:",
      closing: "The invoice is attached to this email. Reply to this message if you need a copy sent elsewhere.",
    },
  } as Record<MailTemplate, MailTemplateContent>,
  BRAND_NAME: "QuoteFlow",
};
