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
      title: "Penawaran Harga",
      subtitle: "Quotation",
      footerNote: "Email ini dikirim secara resmi sebagai bagian dari komunikasi penawaran harga.",
      footerSign: "Terima kasih telah mempercayai layanan kami.",
    },
    invoice: {
      title: "Invoice",
      subtitle: "Invoice",
      footerNote: "Email ini dikirim secara resmi sebagai bagian dari komunikasi penagihan.",
      footerSign: "Terima kasih telah mempercayai layanan kami.",
    },
  } as Record<MailTemplate, MailTemplateContent>,
  BRAND_NAME: "QuoteFlow",
};
