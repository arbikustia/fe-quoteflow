import type { ChangeEvent, SyntheticEvent } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MAIL_CONFIG } from "@/modules/mail/Mail.config";
import type { MailTemplate } from "@/modules/mail/Mail.type";
import {
  buildMailSendFormData,
  useGetMailSendersQuery,
  useSendMailMutation,
} from "@/services/mail/mail.service";

import { getSelectedFile, isPdfFile, validateMailValues } from "./MailCreate.helpers";
import type {
  EmailSenderOption,
  MailComposeFieldState,
  MailComposeFormState,
  MailComposeValues,
  MailCompositeErrors,
} from "./MailCreate.type";

import type { ApiMessages } from "@/types/api.type";

/**
 * Format backend messages into a display string.
 * @param {ApiMessages} [messages] - Backend response messages
 * @returns {string} Display message
 */
const _formatMessages = (messages?: ApiMessages): string => {
  if (!messages) {
    return "Unable to send mail. Please try again.";
  }

  return Array.isArray(messages) ? messages.join(" ") : messages;
};

/**
 * Hook loading email sender options for the From field.
 * @returns {{ senderOptions: EmailSenderOption[]; isSenderLoading: boolean; senderError?: string }} Sender select state
 */
const useSenderOptions = (): { senderOptions: EmailSenderOption[]; isSenderLoading: boolean; senderError?: string } => {
  const { data, isLoading, error } = useGetMailSendersQuery();

  if (isLoading) {
    return { senderOptions: [], isSenderLoading: true };
  }

  if (error) {
    return { senderOptions: [], isSenderLoading: false, senderError: "Unable to load email senders." };
  }

  const senders = data?.data ?? [];

  return {
    senderOptions: senders.map((sender) => ({ label: sender.email, value: sender.email })),
    isSenderLoading: false,
  };
};

/**
 * Hook owning the PDF attachment field.
 * @returns {{ attachment?: File; attachmentUrl: string; attachmentError?: string; handleAttachmentChange: (event: ChangeEvent<HTMLInputElement>) => void; handleAttachmentRemove: () => void }} Attachment state
 */
const useAttachmentField = (): {
  attachment?: File;
  attachmentUrl: string;
  attachmentError?: string;
  handleAttachmentChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleAttachmentRemove: () => void;
} => {
  const [attachment, setAttachment] = useState<File>();
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [attachmentError, setAttachmentError] = useState<string>();

  useEffect(() => () => {
    if (attachmentUrl) {
      URL.revokeObjectURL(attachmentUrl);
    }
  }, [attachmentUrl]);

  /**
   * Store the selected PDF and expose a preview URL.
   * @param {File} file - Selected file
   * @returns {void}
   */
  const _previewFile = (file: File): void => {
    setAttachment(file);
    setAttachmentUrl(URL.createObjectURL(file));
  };

  /**
   * Store the selected file when it is a PDF.
   * @param {ChangeEvent<HTMLInputElement>} event - File input change event
   * @returns {void}
   */
  const handleAttachmentChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = getSelectedFile(event);

    if (!file) {
      return;
    }

    if (!isPdfFile(file)) {
      setAttachmentError("Attachment must be a PDF file.");

      return;
    }

    setAttachmentError(undefined);
    _previewFile(file);
  };

  /**
   * Clear the selected attachment.
   * @returns {void}
   */
  const handleAttachmentRemove = (): void => {
    setAttachment(undefined);
    setAttachmentUrl("");
    setAttachmentError(undefined);
  };

  return { attachment, attachmentUrl, attachmentError, handleAttachmentChange, handleAttachmentRemove };
};

/**
 * Hook owning compose fields, validation errors, and field handlers.
 * @returns {MailComposeFieldState} Field state
 */
const useComposeFields = (): MailComposeFieldState => {
  const [senderId, setSenderId] = useState("");
  const [template, setTemplate] = useState<MailTemplate>(MAIL_CONFIG.DEFAULT_TEMPLATE);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<MailCompositeErrors>({});
  const attachmentField = useAttachmentField();

  const values: MailComposeValues = {
    senderId,
    template,
    to,
    subject,
    body,
    attachment: attachmentField.attachment,
  };

  /**
   * Handle sender selection.
   * @param {string} value - Selected sender id
   * @returns {void}
   */
  const handleSenderChange = (value: string): void => setSenderId(value);

  /**
   * Handle template selection.
   * @param {string} value - Selected template
   * @returns {void}
   */
  const handleTemplateChange = (value: string): void => setTemplate(value as MailTemplate);

  /**
   * Handle recipient input change.
   * @param {ChangeEvent<HTMLInputElement>} event - Change event
   * @returns {void}
   */
  const handleToChange = (event: ChangeEvent<HTMLInputElement>): void => setTo(event.target.value);

  /**
   * Handle subject input change.
   * @param {ChangeEvent<HTMLInputElement>} event - Change event
   * @returns {void}
   */
  const handleSubjectChange = (event: ChangeEvent<HTMLInputElement>): void => setSubject(event.target.value);

  /**
   * Handle body input change.
   * @param {ChangeEvent<HTMLTextAreaElement>} event - Change event
   * @returns {void}
   */
  const handleBodyChange = (event: ChangeEvent<HTMLTextAreaElement>): void => setBody(event.target.value);

  /**
   * Validate the current values.
   * @returns {boolean} Whether the values are valid
   */
  const validate = (): boolean => {
    const nextErrors = validateMailValues(values);

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  return {
    ...values,
    errors: { ...errors, attachmentError: attachmentField.attachmentError },
    attachmentUrl: attachmentField.attachmentUrl,
    handleSenderChange,
    handleTemplateChange,
    handleToChange,
    handleSubjectChange,
    handleBodyChange,
    handleAttachmentChange: attachmentField.handleAttachmentChange,
    handleAttachmentRemove: attachmentField.handleAttachmentRemove,
    validate,
  };
};

/**
 * Hook sending the compose form through the email endpoint.
 * @returns {{ isSubmitting: boolean; errorMessage?: string; send: (values: MailComposeValues) => Promise<boolean> }} Send state
 */
const useMailSend = (): {
  isSubmitting: boolean;
  errorMessage?: string;
  send: (values: MailComposeValues) => Promise<boolean>;
} => {
  const [sendMail, { isLoading }] = useSendMailMutation();
  const [errorMessage, setErrorMessage] = useState<string>();

  /**
   * Send the mail.
   * @param {MailComposeValues} values - Validated form values
   * @returns {Promise<boolean>} Whether the mail was sent
   */
  const send = async (values: MailComposeValues): Promise<boolean> => {
    setErrorMessage(undefined);

    const formData = buildMailSendFormData(values.senderId, values.to, values.subject, values.body, values.attachment, values.template);

    try {
      const response = await sendMail(formData).unwrap();

      if (!response.status) {
        setErrorMessage(_formatMessages(response.messages));

        return false;
      }

      return true;
    } catch {
      setErrorMessage("Unable to send mail. Please try again.");

      return false;
    }
  };

  return { isSubmitting: isLoading, errorMessage, send };
};

/**
 * Hook managing the mail compose form.
 * @returns {MailComposeFormState} Compose form state
 */
export const useMailCreate = (): MailComposeFormState => {
  const navigate = useNavigate();
  const senderState = useSenderOptions();
  const fields = useComposeFields();
  const submission = useMailSend();

  /**
   * Submit the compose form.
   * @param {SyntheticEvent} event - Form submission event
   * @returns {Promise<void>} Completion promise
   */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();

    if (!fields.validate()) {
      return;
    }

    const payload: MailComposeValues = {
      senderId: fields.senderId,
      template: fields.template,
      to: fields.to,
      subject: fields.subject,
      body: fields.body,
      attachment: fields.attachment,
    };

    if (await submission.send(payload)) {
      navigate("/mail", { state: { successMessage: "Mail sent successfully." } });
    }
  };

  return {
    senderId: fields.senderId,
    template: fields.template,
    templateOptions: MAIL_CONFIG.TEMPLATE_OPTIONS,
    to: fields.to,
    subject: fields.subject,
    body: fields.body,
    attachmentName: fields.attachment?.name ?? "",
    attachmentUrl: fields.attachmentUrl,
    senderOptions: senderState.senderOptions,
    isSenderLoading: senderState.isSenderLoading,
    senderError: senderState.senderError ?? fields.errors.senderError,
    isSubmitting: submission.isSubmitting,
    errorMessage: submission.errorMessage,
    toError: fields.errors.toError,
    subjectError: fields.errors.subjectError,
    bodyError: fields.errors.bodyError,
    attachmentError: fields.errors.attachmentError,
    handleSenderChange: fields.handleSenderChange,
    handleTemplateChange: fields.handleTemplateChange,
    handleToChange: fields.handleToChange,
    handleSubjectChange: fields.handleSubjectChange,
    handleBodyChange: fields.handleBodyChange,
    handleAttachmentChange: fields.handleAttachmentChange,
    handleAttachmentRemove: fields.handleAttachmentRemove,
    handleSubmit,
    goBack: (): void => {
      navigate("/mail");
    },
  };
};
