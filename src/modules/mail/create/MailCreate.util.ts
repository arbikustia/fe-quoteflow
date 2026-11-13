import type { ChangeEvent } from "react";

import type { ApiMessages } from "@/types/api.type";

import type { EmailSenderOption, MailComposeValues, MailCompositeErrors } from "./MailCreate.type";

import type { ApiInvoice } from "@/modules/invoice/Invoice.type";
import type { ApiQuotation } from "@/modules/quotation/Quotation.type";

const EMAIL_REGEX = /^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PDF_MIME_TYPE = "application/pdf";

/**
 * Strip html tags from a rich text string.
 * @param {string} html - Rich text
 * @returns {string} Plain text
 */
const _stripTags = (html: string): string => {
  let text = "";
  let depth = 0;

  for (let index = 0; index < html.length; index += 1) {
    const char = html[index];

    if (char === "<") {
      depth += 1;
    } else if (char === ">" && depth > 0) {
      depth -= 1;
      text += " ";
    } else if (depth === 0) {
      text += char;
    }
  }

  return text;
};

/**
 * Check whether rich text content has no visible text.
 * @param {string} html - Rich text body
 * @returns {boolean} Whether the body is visually empty
 */
export const isBlankBody = (html: string): boolean => {
  const text = _stripTags(html).replace(/&nbsp;/g, " ");

  return text.trim().length === 0;
};

/**
 * Validate a compose form payload.
 * @param {Pick<MailComposeValues, "senderId" | "to" | "subject" | "body">} values - Form values
 * @returns {MailCompositeErrors} Validation errors keyed by field
 */
export const validateMailValues = (values: Pick<MailComposeValues, "senderId" | "to" | "subject" | "body">): MailCompositeErrors => {
  const errors: MailCompositeErrors = {};

  if (!values.senderId) {
    errors.senderError = "Sender is required.";
  }

  if (!values.to) {
    errors.toError = "Recipient email is required.";
  } else if (!EMAIL_REGEX.test(values.to)) {
    errors.toError = "Please enter a valid email address.";
  }

  if (!values.subject) {
    errors.subjectError = "Subject is required.";
  }

  if (!values.body || isBlankBody(values.body)) {
    errors.bodyError = "Message body is required.";
  }

  return errors;
};

/**
 * Check whether a file is a PDF.
 * @param {File} file - Selected file
 * @returns {boolean} Whether the file is a PDF
 */
export const isPdfFile = (file: File): boolean => file.type === PDF_MIME_TYPE;

/**
 * Read the selected attachment from a file input event.
 * @param {ChangeEvent<HTMLInputElement>} event - File input change event
 * @returns {File | undefined} Selected file
 */
export const getSelectedFile = (event: ChangeEvent<HTMLInputElement>): File | undefined => event.target.files?.[0];

/**
 * Build quotation select options labelled with number and customer.
 * @param {ApiQuotation[]} quotations - Quotations
 * @returns {EmailSenderOption[]} - Select options
 */
export const buildQuotationOptions = (quotations: ApiQuotation[]): EmailSenderOption[] =>
  quotations.map((quotation) => ({
    label: quotation.transaction?.customer_name ? `${quotation.quotation_no} - ${quotation.transaction.customer_name}` : quotation.quotation_no,
    value: quotation.id,
  }));

/**
 * Build invoice select options labelled with number and customer.
 * @param {ApiInvoice[]} invoices - Invoices
 * @returns {EmailSenderOption[]} - Select options
 */
export const buildInvoiceOptions = (invoices: ApiInvoice[]): EmailSenderOption[] =>
  invoices.map((invoice) => {
    const customerName = invoice.customer?.name ?? invoice.quotation?.transaction?.customer_name;

    return { label: customerName ? `${invoice.invoice_no} - ${customerName}` : invoice.invoice_no, value: invoice.id };
  });

/**
 * Format backend messages into a display string.
 * @param {ApiMessages} [messages] - Backend response messages
 * @returns {string} - Display message
 */
export const formatSendMessages = (messages?: ApiMessages): string => {
  if (!messages) {
    return "Unable to send mail. Please try again.";
  }

  return Array.isArray(messages) ? messages.join(" ") : messages;
};
