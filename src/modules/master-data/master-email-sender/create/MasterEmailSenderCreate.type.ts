import type { ChangeEvent, SubmitEvent } from "react";
import { z } from "zod";

import { EMAIL_SENDER_ACTIVE_STATUS } from "../MasterEmailSender.config";
import type { EmailSenderCreatePayload, EmailSenderMutationResponse, EmailSenderUpdatePayload } from "../MasterEmailSender.type";

import { EMAIL_SENDER_FORM_MESSAGE, EMAIL_SENDER_MAX_PORT } from "./MasterEmailSenderCreate.config";

/** Email sender form input in edit mode; an empty password keeps the current one. */
export const EmailSenderEditFormSchema = z.object({
  name: z.string().trim().min(1, EMAIL_SENDER_FORM_MESSAGE.NAME_REQUIRED),
  email: z
    .string()
    .trim()
    .min(1, EMAIL_SENDER_FORM_MESSAGE.EMAIL_REQUIRED)
    .pipe(z.email(EMAIL_SENDER_FORM_MESSAGE.EMAIL_INVALID)),
  smtpHost: z.string().trim().min(1, EMAIL_SENDER_FORM_MESSAGE.SMTP_HOST_REQUIRED),
  smtpPort: z
    .number()
    .nullable()
    .pipe(
      z
        .number({ error: EMAIL_SENDER_FORM_MESSAGE.SMTP_PORT_REQUIRED })
        .int(EMAIL_SENDER_FORM_MESSAGE.SMTP_PORT_INVALID)
        .min(1, EMAIL_SENDER_FORM_MESSAGE.SMTP_PORT_INVALID)
        .max(EMAIL_SENDER_MAX_PORT, EMAIL_SENDER_FORM_MESSAGE.SMTP_PORT_INVALID),
    ),
  smtpUsername: z.string().trim().min(1, EMAIL_SENDER_FORM_MESSAGE.SMTP_USERNAME_REQUIRED),
  smtpPassword: z.string(),
  enableSsl: z.boolean(),
  isDefault: z.boolean(),
  isActive: z.boolean(),
});

/** Email sender form input in create mode; the password is required. */
export const EmailSenderCreateFormSchema = EmailSenderEditFormSchema.extend({
  smtpPassword: z.string().trim().min(1, EMAIL_SENDER_FORM_MESSAGE.SMTP_PASSWORD_REQUIRED),
});

/** Raw form values; the port is null while its input is empty. */
export type EmailSenderFormValues = z.input<typeof EmailSenderEditFormSchema>;

/** Form values after validation. */
export type EmailSenderValidValues = z.output<typeof EmailSenderEditFormSchema>;

/** Form field names. */
export type EmailSenderFieldName = keyof EmailSenderFormValues;

/** Fields edited through a text input. */
export type EmailSenderTextField = "name" | "email" | "smtpHost" | "smtpUsername" | "smtpPassword";

/** Fields edited through a switch. */
export type EmailSenderToggleField = "enableSsl" | "isDefault" | "isActive";

/** Validation message per field. */
export type EmailSenderFieldErrors = Partial<Record<EmailSenderFieldName, string>>;

/** Sender from `GET /api/email-sender/{id}`, normalized into form values. */
export const EmailSenderDetailSchema = z
  .object({
    name: z.string().nullish().transform((value): string => value ?? ""),
    email: z.string().nullish().transform((value): string => value ?? ""),
    smtp_host: z.string().nullish().transform((value): string => value ?? ""),
    smtp_port: z.number().nullish().transform((value): number | null => value ?? null),
    smtp_username: z.string().nullish().transform((value): string => value ?? ""),
    enable_ssl: z.boolean().catch(false),
    is_default: z.boolean().catch(false),
    status: z.number().catch(EMAIL_SENDER_ACTIVE_STATUS),
  })
  .transform((sender): EmailSenderFormValues => ({
    name: sender.name,
    email: sender.email,
    smtpHost: sender.smtp_host,
    smtpPort: sender.smtp_port,
    smtpUsername: sender.smtp_username,
    smtpPassword: "",
    enableSsl: sender.enable_ssl,
    isDefault: sender.is_default,
    isActive: sender.status === EMAIL_SENDER_ACTIVE_STATUS,
  }));

/** Whether the form creates a new sender or edits an existing one. */
export type EmailSenderFormMode = "create" | "edit";

/** Whether the form can be shown yet. */
export type EmailSenderFormStatus = "loading" | "error" | "ready";

/** Copy that differs between create and edit mode. */
export type EmailSenderFormModeText = {
  title: string;
  subtitle: string;
  submitLabel: string;
  submittingLabel: string;
  passwordPlaceholder: string;
  successMessage: string;
  failureMessage: string;
};

/** Normalized sender detail query used to seed the form. */
export type EmailSenderFormSource = {
  formStatus: EmailSenderFormStatus;
  initialValues: EmailSenderFormValues;
};

/** Raw RTK Query state consumed by the detail normalizer. */
export type EmailSenderDetailQueryState = {
  data?: EmailSenderMutationResponse;
  isLoading: boolean;
  isError: boolean;
};

/** Result of an RTK Query mutation trigger. */
export type EmailSenderMutationResult = {
  unwrap: () => Promise<EmailSenderMutationResponse>;
};

/** Mutation triggers and target of a sender submit. */
export type EmailSenderSubmitTarget = {
  id?: string;
  createEmailSender: (payload: EmailSenderCreatePayload) => EmailSenderMutationResult;
  updateEmailSender: (payload: EmailSenderUpdatePayload) => EmailSenderMutationResult;
};

/** Inputs of the create / edit form hook. */
export type MasterEmailSenderCreateParams = EmailSenderSubmitTarget & {
  mode: EmailSenderFormMode;
  initialValues: EmailSenderFormValues;
};

/** Submit state and handlers of the form. */
export type EmailSenderSubmission = {
  errorMessage?: string;
  submitEmailSender: (values: EmailSenderValidValues) => Promise<void>;
  handleBack: () => void;
};

/** Change handler per text field. */
export type EmailSenderTextChangeHandlers = Record<EmailSenderTextField, (event: ChangeEvent<HTMLInputElement>) => void>;

/** Change handler per switch field. */
export type EmailSenderToggleChangeHandlers = Record<EmailSenderToggleField, (checked: boolean) => void>;

/** Form state and handlers owned by the module hook. */
export type MasterEmailSenderCreateController = {
  values: EmailSenderFormValues;
  fieldErrors: EmailSenderFieldErrors;
  errorMessage?: string;
  handleTextChange: EmailSenderTextChangeHandlers;
  handlePortChange: (value: number | null) => void;
  handleToggleChange: EmailSenderToggleChangeHandlers;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  handleBack: () => void;
};

/** Props of the create / edit form view. */
export type MasterEmailSenderCreateProps = {
  mode: EmailSenderFormMode;
  formStatus: EmailSenderFormStatus;
  values: EmailSenderFormValues;
  fieldErrors: EmailSenderFieldErrors;
  isSubmitting: boolean;
  errorMessage?: string;
  onTextChange: EmailSenderTextChangeHandlers;
  onPortChange: (value: number | null) => void;
  onToggleChange: EmailSenderToggleChangeHandlers;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  onBack: () => void;
};
