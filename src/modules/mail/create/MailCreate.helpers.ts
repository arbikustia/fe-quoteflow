import type { ChangeEvent } from "react";

import type { MailComposeValues,MailCompositeErrors } from "./MailCreate.type";

const EMAIL_REGEX = /^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PDF_MIME_TYPE = "application/pdf";

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

  if (!values.body) {
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
