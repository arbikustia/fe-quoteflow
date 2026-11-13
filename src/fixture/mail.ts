import type { MailComposeFormState } from "@/modules/mail/create/MailCreate.type";
import type { MailData, MailProps } from "@/modules/mail/Mail.type";

export const MOCK_MAIL_ROWS: MailData[] = [
  {
    id: "mail-1",
    senderEmail: "sender@example.com",
    recipientEmail: "customer@example.com",
    subject: "Quotation follow up",
    status: "active",
    sentAt: "2026-01-01 10:00",
    createdAt: "2026-01-01 10:00",
  },
];

export const MOCK_MAIL_PROPS: MailProps = {
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  paginatedData: MOCK_MAIL_ROWS,
  totalCount: 1,
  isLoading: false,
  isEmpty: false,
  isMissingData: false,
  goToPage: jest.fn(),
  changePageSize: jest.fn(),
  setSearchTerm: jest.fn(),
  onCompose: jest.fn(),
  onBack: jest.fn(),
};

export const MOCK_MAIL_FORM_PROPS: MailComposeFormState = {
  senderId: "sales@example.com",
  template: "quotation",
  to: "customer@example.com",
  subject: "Quotation follow up",
  body: "Hello",
  quotationId: "",
  invoiceId: "",
  quotationOptions: [{ label: "QUOT20261107151923", value: "q-1" }],
  invoiceOptions: [{ label: "INV-001", value: "i-1" }],
  attachmentName: "quotation.pdf",
  attachmentUrl: "blob:quotation-preview",
  senderOptions: [{ label: "sales@example.com", value: "sales@example.com" }],
  templateOptions: [
    { label: "Quotation", value: "quotation" },
    { label: "Invoice", value: "invoice" },
  ],
  isSenderLoading: false,
  isSubmitting: false,
  handleSenderChange: jest.fn(),
  handleTemplateChange: jest.fn(),
  handleToChange: jest.fn(),
  handleSubjectChange: jest.fn(),
  handleBodyChange: jest.fn(),
  handleQuotationChange: jest.fn(),
  handleInvoiceChange: jest.fn(),
  handleAttachmentChange: jest.fn(),
  handleAttachmentRemove: jest.fn(),
  handleSubmit: jest.fn().mockResolvedValue(undefined),
  goBack: jest.fn(),
};
