import type { ChangeEvent, SyntheticEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { generateQuotationPdfBlob } from "@/utils/pdfGenerator";

import type {
  MailAttachmentFieldState,
  MailComposeFieldState,
  MailComposeFormState,
  MailComposeValues,
  MailCompositeErrors,
  MailDocumentState,
  MailFieldProps,
  MailInputFieldState,
  MailNavigate,
  MailPdfInput,
  MailSenderOptionsState,
  MailSendState,
  MailStatusProps,
} from "./MailCreate.type";
import {
  buildInvoiceOptions,
  buildQuotationOptions,
  formatSendMessages,
  getSelectedFile,
  isPdfFile,
  validateMailValues,
} from "./MailCreate.util";

import { MAIL_CONFIG } from "@/modules/mail/Mail.config";
import type { MailTemplate } from "@/modules/mail/Mail.type";
import { quotationToQuoteData } from "@/modules/quotation/Quotation.util";
import { useGetInvoiceOptionsQuery } from "@/services/invoice.service";
import {
  buildMailSendFormData,
  useGetMailSendersQuery,
  useSendMailMutation,
} from "@/services/mail/mail.service";
import { useGetQuotationOptionsQuery } from "@/services/quotation.service";

/**
 * Hook loading email sender options for the From field.
 * @returns {MailSenderOptionsState} - Sender select state
 */
export const useSenderOptions = (): MailSenderOptionsState => {
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
 * @returns {MailAttachmentFieldState} - Attachment state
 */
export const useAttachmentField = (): MailAttachmentFieldState => {
  const [attachment, setAttachment] = useState<File>();
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [attachmentError, setAttachmentError] = useState<string>();

  useEffect((): (() => void) => (): void => {
    if (attachmentUrl) {
      URL.revokeObjectURL(attachmentUrl);
    }
  }, [attachmentUrl]);

  /**
   * Store a PDF and expose a preview URL.
   * @param {File} file - PDF file
   * @returns {void} - Nothing
   */
  const attachFile = (file: File): void => {
    setAttachmentError(undefined);
    setAttachment(file);
    setAttachmentUrl(URL.createObjectURL(file));
  };

  /**
   * Store the selected file when it is a PDF.
   * @param {ChangeEvent<HTMLInputElement>} event - File input change event
   * @returns {void} - Nothing
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

    attachFile(file);
  };

  /**
   * Clear the selected attachment.
   * @returns {void} - Nothing
   */
  const handleAttachmentRemove = (): void => {
    setAttachment(undefined);
    setAttachmentUrl("");
    setAttachmentError(undefined);
  };

  return { attachment, attachmentUrl, attachmentError, attachFile, handleAttachmentChange, handleAttachmentRemove };
};

/**
 * Hook owning the plain input fields and their handlers.
 * @returns {MailInputFieldState} - Input field state
 */
export const useInputFields = (): MailInputFieldState => {
  const [senderId, setSenderId] = useState("");
  const [template, setTemplate] = useState<MailTemplate>(MAIL_CONFIG.DEFAULT_TEMPLATE);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  /**
   * Handle template selection.
   * @param {string} value - Selected template
   * @returns {void} - Nothing
   */
  const handleTemplateChange = (value: string): void => setTemplate(value as MailTemplate);

  /**
   * Handle recipient input change.
   * @param {ChangeEvent<HTMLInputElement>} event - Change event
   * @returns {void} - Nothing
   */
  const handleToChange = (event: ChangeEvent<HTMLInputElement>): void => setTo(event.target.value);

  /**
   * Handle subject input change.
   * @param {ChangeEvent<HTMLInputElement>} event - Change event
   * @returns {void} - Nothing
   */
  const handleSubjectChange = (event: ChangeEvent<HTMLInputElement>): void => setSubject(event.target.value);

  return { senderId, template, to, subject, body, handleSenderChange: setSenderId, handleTemplateChange, handleToChange, handleSubjectChange, handleBodyChange: setBody };
};

/**
 * Hook owning the selected quotation or invoice and its options.
 * @param {MailTemplate} template - Active template
 * @returns {MailDocumentState} - Document state
 */
export const useDocumentFields = (template: MailTemplate): MailDocumentState => {
  const [quotationId, setQuotationId] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const { data: quotationsData } = useGetQuotationOptionsQuery();
  const { data: invoicesData } = useGetInvoiceOptionsQuery();
  const quotations = quotationsData?.status ? quotationsData.data : [];
  const invoices = invoicesData?.status ? invoicesData.data : [];
  const isInvoiceTemplate = template === "invoice";
  const selectedQuotation = isInvoiceTemplate ? undefined : quotations.find((quotation) => quotation.id === quotationId);
  const selectedInvoice = isInvoiceTemplate ? invoices.find((invoice) => invoice.id === invoiceId) : undefined;

  return {
    quotationId,
    invoiceId,
    selectedQuotation,
    selectedInvoice,
    documentQuotation: selectedInvoice?.quotation ?? selectedQuotation,
    quotationOptions: buildQuotationOptions(quotations),
    invoiceOptions: buildInvoiceOptions(invoices),
    handleQuotationChange: setQuotationId,
    handleInvoiceChange: setInvoiceId,
  };
};

/**
 * Hook generating the document PDF and attaching it.
 * @param {MailPdfInput} input - Document and attachment state
 * @returns {() => Promise<File | undefined>} - Resolver of the attachment
 */
export const usePdfAttachment = (input: MailPdfInput): (() => Promise<File | undefined>) => {
  const { documentQuotation, hasDocumentId, attachmentField } = input;
  const pendingPdf = useRef<Promise<File> | undefined>(undefined);

  useEffect(() => {
    if (documentQuotation) {
      pendingPdf.current = generateQuotationPdfBlob(quotationToQuoteData(documentQuotation)).then((file) => {
        attachmentField.attachFile(file);

        return file;
      }).catch((error: Error) => {
        attachmentField.handleAttachmentRemove();
        throw error;
      });
    } else if (hasDocumentId) {
      attachmentField.handleAttachmentRemove();
    }
  }, [documentQuotation, hasDocumentId]);

  /**
   * Resolve the quotation PDF attachment, waiting for generation when still running.
   * @returns {Promise<File | undefined>} - Attachment file
   */
  return async (): Promise<File | undefined> => {
    if (!pendingPdf.current) {
      return attachmentField.attachment;
    }

    try {
      return await pendingPdf.current;
    } catch {
      return undefined;
    }
  };
};

/**
 * Hook owning compose fields, validation errors, and field handlers.
 * @returns {MailComposeFieldState} - Field state
 */
export const useComposeFields = (): MailComposeFieldState => {
  const [errors, setErrors] = useState<MailCompositeErrors>({});
  const inputs = useInputFields();
  const documents = useDocumentFields(inputs.template);
  const attachmentField = useAttachmentField();
  const getAttachment = usePdfAttachment({
    documentQuotation: documents.documentQuotation,
    hasDocumentId: Boolean(documents.quotationId || documents.invoiceId),
    attachmentField,
  });

  /**
   * Validate the current values and store the errors.
   * @returns {boolean} - Whether the form is valid
   */
  const validate = (): boolean => {
    const nextErrors = validateMailValues(inputs);

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  return {
    ...inputs,
    ...documents,
    attachment: attachmentField.attachment,
    quotation: documents.selectedQuotation,
    invoice: documents.selectedInvoice,
    errors: { ...errors, attachmentError: attachmentField.attachmentError },
    attachmentUrl: attachmentField.attachmentUrl,
    handleAttachmentChange: attachmentField.handleAttachmentChange,
    handleAttachmentRemove: attachmentField.handleAttachmentRemove,
    getAttachment,
    validate,
  };
};

/**
 * Hook sending the compose form through the email endpoint.
 * @returns {MailSendState} - Send state
 */
export const useMailSend = (): MailSendState => {
  const [sendMail, { isLoading }] = useSendMailMutation();
  const [errorMessage, setErrorMessage] = useState<string>();

  /**
   * Send the mail.
   * @param {MailComposeValues} values - Validated form values
   * @returns {Promise<boolean>} - Whether the mail was sent
   */
  const send = async (values: MailComposeValues): Promise<boolean> => {
    setErrorMessage(undefined);

    const formData = buildMailSendFormData(values);

    try {
      const response = await sendMail(formData).unwrap();

      if (!response.status) {
        setErrorMessage(formatSendMessages(response.messages));

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
 * Pick the field props the form renders from the field state.
 * @param {MailComposeFieldState} fields - Field state
 * @returns {MailFieldProps} - Form field props
 */
const _toFieldProps = (fields: MailComposeFieldState): MailFieldProps => ({
  senderId: fields.senderId,
  template: fields.template,
  to: fields.to,
  subject: fields.subject,
  body: fields.body,
  quotationId: fields.quotationId,
  invoiceId: fields.invoiceId,
  selectedQuotation: fields.selectedQuotation,
  selectedInvoice: fields.selectedInvoice,
  quotationOptions: fields.quotationOptions,
  invoiceOptions: fields.invoiceOptions,
  attachmentUrl: fields.attachmentUrl,
  toError: fields.errors.toError,
  subjectError: fields.errors.subjectError,
  bodyError: fields.errors.bodyError,
  attachmentError: fields.errors.attachmentError,
  handleSenderChange: fields.handleSenderChange,
  handleTemplateChange: fields.handleTemplateChange,
  handleToChange: fields.handleToChange,
  handleSubjectChange: fields.handleSubjectChange,
  handleBodyChange: fields.handleBodyChange,
  handleQuotationChange: fields.handleQuotationChange,
  handleInvoiceChange: fields.handleInvoiceChange,
  handleAttachmentChange: fields.handleAttachmentChange,
  handleAttachmentRemove: fields.handleAttachmentRemove,
});

/**
 * Pick the status props the form renders from sender and send state.
 * @param {MailComposeFieldState} fields - Field state
 * @param {MailSenderOptionsState} senderState - Sender state
 * @param {MailSendState} submission - Send state
 * @returns {MailStatusProps} - Form status props
 */
const _toStatusProps = (fields: MailComposeFieldState, senderState: MailSenderOptionsState, submission: MailSendState): MailStatusProps => ({
  templateOptions: MAIL_CONFIG.TEMPLATE_OPTIONS,
  attachmentName: fields.attachment?.name ?? "",
  senderOptions: senderState.senderOptions,
  isSenderLoading: senderState.isSenderLoading,
  senderError: senderState.senderError ?? fields.errors.senderError,
  isSubmitting: submission.isSubmitting,
  errorMessage: submission.errorMessage,
});

/**
 * Hook building the compose form submit handler.
 * @param {MailComposeFieldState} fields - Field state
 * @param {MailSendState} submission - Send state
 * @param {MailNavigate} navigate - Router navigate
 * @returns {(event: SyntheticEvent) => Promise<void>} - Submit handler
 */
export const useMailSubmit = (
  fields: MailComposeFieldState,
  submission: MailSendState,
  navigate: MailNavigate,
): ((event: SyntheticEvent) => Promise<void>) => async (event: SyntheticEvent): Promise<void> => {
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
    attachment: await fields.getAttachment(),
    quotation: fields.quotation,
    invoice: fields.invoice,
  };

  if (await submission.send(payload)) {
    await navigate("/mail", { state: { successMessage: "Mail sent successfully." } });
  }
};

/**
 * Hook managing the mail compose form.
 * @returns {MailComposeFormState} - Compose form state
 */
export const useMailCreate = (): MailComposeFormState => {
  const navigate = useNavigate();
  const senderState = useSenderOptions();
  const fields = useComposeFields();
  const submission = useMailSend();
  const handleSubmit = useMailSubmit(fields, submission, navigate);

  /**
   * Navigate back to the mail list.
   * @returns {void} - Nothing
   */
  const goBack = (): void => {
    void navigate("/mail");
  };

  return { ..._toFieldProps(fields), ..._toStatusProps(fields, senderState, submission), handleSubmit, goBack };
};
