import type { ChangeEvent, SyntheticEvent } from "react";

import type { ApiInvoice } from "@/modules/invoice/Invoice.type";
import type { ApiQuotation } from "@/modules/quotation/Quotation.type";

import type { MailTemplate } from "../Mail.type";

export type EmailSenderOption = {
  label: string;
  value: string;
};

export type MailComposeFormState = {
  senderId: string;
  template: MailTemplate;
  to: string;
  subject: string;
  body: string;
  quotationId: string;
  invoiceId: string;
  selectedQuotation?: ApiQuotation;
  selectedInvoice?: ApiInvoice;
  attachmentName: string;
  attachmentUrl: string;
  senderOptions: EmailSenderOption[];
  templateOptions: EmailSenderOption[];
  quotationOptions: EmailSenderOption[];
  invoiceOptions: EmailSenderOption[];
  isSenderLoading: boolean;
  isSubmitting: boolean;
  errorMessage?: string;
  senderError?: string;
  toError?: string;
  subjectError?: string;
  bodyError?: string;
  attachmentError?: string;
  handleSenderChange: (value: string) => void;
  handleTemplateChange: (value: string) => void;
  handleToChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSubjectChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleBodyChange: (value: string) => void;
  handleQuotationChange: (value: string) => void;
  handleInvoiceChange: (value: string) => void;
  handleAttachmentChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleAttachmentRemove: () => void;
  handleSubmit: (event: SyntheticEvent) => void;
  goBack: () => void;
};

export type MailTextFieldConfig = {
  errorMessage?: string;
  id: string;
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  type?: "text" | "email";
  value: string;
};

export type MailComposeValues = {
  senderId: string;
  template: MailTemplate;
  to: string;
  subject: string;
  body: string;
  attachment?: File;
  quotation?: ApiQuotation;
  invoice?: ApiInvoice;
};

export type MailCompositeErrors = {
  senderError?: string;
  toError?: string;
  subjectError?: string;
  bodyError?: string;
  attachmentError?: string;
};

export type MailComposeFieldState = MailComposeValues & {
  errors: MailCompositeErrors;
  attachmentUrl: string;
  handleSenderChange: (value: string) => void;
  handleTemplateChange: (value: string) => void;
  handleToChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSubjectChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleBodyChange: (value: string) => void;
  handleAttachmentChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleAttachmentRemove: () => void;
  getAttachment: () => Promise<File | undefined>;
  validate: () => boolean;
};
