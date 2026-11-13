import type { ChangeEvent, SyntheticEvent } from "react";

import type { MailRouteState, MailTemplate } from "../Mail.type";

import type { ApiInvoice } from "@/modules/invoice/Invoice.type";
import type { ApiQuotation } from "@/modules/quotation/Quotation.type";

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
  handleSubmit: (event: SyntheticEvent) => Promise<void>;
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

export type MailSenderOptionsState = {
  senderOptions: EmailSenderOption[];
  isSenderLoading: boolean;
  senderError?: string;
};

export type MailAttachmentFieldState = {
  attachment?: File;
  attachmentUrl: string;
  attachmentError?: string;
  attachFile: (file: File) => void;
  handleAttachmentChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleAttachmentRemove: () => void;
};

export type MailSendState = {
  isSubmitting: boolean;
  errorMessage?: string;
  send: (values: MailComposeValues) => Promise<boolean>;
};

export type MailInputFieldState = {
  senderId: string;
  template: MailTemplate;
  to: string;
  subject: string;
  body: string;
  handleSenderChange: (value: string) => void;
  handleTemplateChange: (value: string) => void;
  handleToChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSubjectChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleBodyChange: (value: string) => void;
};

export type MailDocumentState = {
  quotationId: string;
  invoiceId: string;
  selectedQuotation?: ApiQuotation;
  selectedInvoice?: ApiInvoice;
  documentQuotation?: ApiQuotation;
  quotationOptions: EmailSenderOption[];
  invoiceOptions: EmailSenderOption[];
  handleQuotationChange: (value: string) => void;
  handleInvoiceChange: (value: string) => void;
};

export type MailPdfInput = {
  documentQuotation?: ApiQuotation;
  hasDocumentId: boolean;
  attachmentField: MailAttachmentFieldState;
};

export type MailComposeFieldState = MailInputFieldState & MailDocumentState & {
  attachment?: File;
  quotation?: ApiQuotation;
  invoice?: ApiInvoice;
  errors: MailCompositeErrors;
  attachmentUrl: string;
  handleAttachmentChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleAttachmentRemove: () => void;
  getAttachment: () => Promise<File | undefined>;
  validate: () => boolean;
};

export type MailFieldProps = Pick<
  MailComposeFormState,
  | "senderId" | "template" | "to" | "subject" | "body" | "quotationId" | "invoiceId" | "selectedQuotation" | "selectedInvoice"
  | "quotationOptions" | "invoiceOptions" | "attachmentUrl" | "toError" | "subjectError" | "bodyError" | "attachmentError"
  | "handleSenderChange" | "handleTemplateChange" | "handleToChange" | "handleSubjectChange" | "handleBodyChange"
  | "handleQuotationChange" | "handleInvoiceChange" | "handleAttachmentChange" | "handleAttachmentRemove"
>;

export type MailStatusProps = Pick<
  MailComposeFormState,
  "templateOptions" | "attachmentName" | "senderOptions" | "isSenderLoading" | "senderError" | "isSubmitting" | "errorMessage"
>;

export type MailNavigate = (path: string, options?: { state: MailRouteState }) => void | Promise<void>;
