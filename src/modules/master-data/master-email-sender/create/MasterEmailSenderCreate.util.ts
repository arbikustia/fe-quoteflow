import type { ChangeEvent } from "react";
import type { FieldErrors, Resolver, ResolverResult } from "react-hook-form";

import type { ApiMessages } from "@/types/api.type";

import { EMAIL_SENDER_ACTIVE_STATUS, EMAIL_SENDER_INACTIVE_STATUS } from "../MasterEmailSender.config";
import type { EmailSenderCreatePayload, EmailSenderMutationResponse } from "../MasterEmailSender.type";

import { EMAIL_SENDER_FORM_DEFAULT_VALUES, EMAIL_SENDER_FORM_MESSAGE } from "./MasterEmailSenderCreate.config";
import type {
  EmailSenderDetailQueryState,
  EmailSenderFieldErrors,
  EmailSenderFieldName,
  EmailSenderFormMode,
  EmailSenderFormSource,
  EmailSenderFormValues,
  EmailSenderSubmitTarget,
  EmailSenderTextChangeHandlers,
  EmailSenderTextField,
  EmailSenderToggleChangeHandlers,
  EmailSenderToggleField,
  EmailSenderValidValues,
} from "./MasterEmailSenderCreate.type";
import { EmailSenderCreateFormSchema, EmailSenderDetailSchema, EmailSenderEditFormSchema } from "./MasterEmailSenderCreate.type";

/** Validation schema per form mode: the password is only required when creating. */
const EMAIL_SENDER_FORM_SCHEMA: Record<EmailSenderFormMode, typeof EmailSenderEditFormSchema> = {
  create: EmailSenderCreateFormSchema,
  edit: EmailSenderEditFormSchema,
};

/**
 * Join backend messages into one display string.
 * @param {ApiMessages} [messages] - Backend response messages
 * @returns {string} - Display message
 */
export const formatApiMessages = (messages?: ApiMessages): string => {
  if (Array.isArray(messages)) {
    return messages.join(" ");
  }

  return messages || EMAIL_SENDER_FORM_MESSAGE.REQUEST_FAILED;
};

/**
 * Normalize the sender detail query into the form source (single upstream fallback).
 * @param {EmailSenderDetailQueryState} queryState - RTK Query data and flags; data is undefined in create mode
 * @returns {EmailSenderFormSource} - Form status and initial values
 */
export const normalizeEmailSenderFormSource = (queryState: EmailSenderDetailQueryState): EmailSenderFormSource => {
  const { data, isLoading, isError } = queryState;

  if (isLoading) {
    return { formStatus: "loading", initialValues: EMAIL_SENDER_FORM_DEFAULT_VALUES };
  }

  if (!data) {
    return { formStatus: isError ? "error" : "ready", initialValues: EMAIL_SENDER_FORM_DEFAULT_VALUES };
  }

  const parsedDetail = EmailSenderDetailSchema.safeParse(data.data);

  if (!data.status || !parsedDetail.success) {
    return { formStatus: "error", initialValues: EMAIL_SENDER_FORM_DEFAULT_VALUES };
  }

  return { formStatus: "ready", initialValues: parsedDetail.data };
};

/**
 * Validate form values with the schema of the given mode.
 * @param {EmailSenderFormValues} values - Current form values
 * @param {EmailSenderFormMode} mode - Form mode
 * @returns {ResolverResult<EmailSenderFormValues, EmailSenderValidValues>} - Parsed values, or the first error per field
 */
export const resolveEmailSenderForm = (
  values: EmailSenderFormValues,
  mode: EmailSenderFormMode,
): ResolverResult<EmailSenderFormValues, EmailSenderValidValues> => {
  const result = EMAIL_SENDER_FORM_SCHEMA[mode].safeParse(values);

  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const errors: FieldErrors<EmailSenderFormValues> = {};

  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as EmailSenderFieldName;

    errors[field] = errors[field] ?? { type: issue.code, message: issue.message };
  });

  return { values: {}, errors };
};

/**
 * Create the react-hook-form resolver for the given mode.
 * @param {EmailSenderFormMode} mode - Form mode
 * @returns {Resolver<EmailSenderFormValues, undefined, EmailSenderValidValues>} - Form resolver
 */
export const createEmailSenderResolver = (mode: EmailSenderFormMode): Resolver<EmailSenderFormValues, undefined, EmailSenderValidValues> => {
  return (values: EmailSenderFormValues): ResolverResult<EmailSenderFormValues, EmailSenderValidValues> => resolveEmailSenderForm(values, mode);
};

/**
 * Pick the message of every field error.
 * @param {FieldErrors<EmailSenderFormValues>} errors - react-hook-form errors
 * @returns {EmailSenderFieldErrors} - Message per field
 */
export const getEmailSenderFieldErrors = (errors: FieldErrors<EmailSenderFormValues>): EmailSenderFieldErrors => {
  const fieldErrors: EmailSenderFieldErrors = {};

  (Object.keys(errors) as EmailSenderFieldName[]).forEach((field) => {
    fieldErrors[field] = errors[field]?.message;
  });

  return fieldErrors;
};

/**
 * Build the create / update request body from validated form values.
 * @param {EmailSenderValidValues} values - Valid form values
 * @returns {EmailSenderCreatePayload} - Request body
 */
export const buildEmailSenderPayload = (values: EmailSenderValidValues): EmailSenderCreatePayload => ({
  name: values.name,
  email: values.email,
  smtp_host: values.smtpHost,
  smtp_port: values.smtpPort,
  smtp_username: values.smtpUsername,
  smtp_password: values.smtpPassword,
  enable_ssl: values.enableSsl,
  is_default: values.isDefault,
  status: values.isActive ? EMAIL_SENDER_ACTIVE_STATUS : EMAIL_SENDER_INACTIVE_STATUS,
});

/**
 * Send the update request when editing, otherwise the create request.
 * @param {EmailSenderValidValues} values - Valid form values
 * @param {EmailSenderSubmitTarget} target - Mutation triggers and sender id
 * @returns {Promise<EmailSenderMutationResponse>} - Mutation response
 */
export const sendEmailSenderMutation = (values: EmailSenderValidValues, target: EmailSenderSubmitTarget): Promise<EmailSenderMutationResponse> => {
  const payload = buildEmailSenderPayload(values);

  if (target.id) {
    return target.updateEmailSender({ ...payload, id: target.id }).unwrap();
  }

  return target.createEmailSender(payload).unwrap();
};

/**
 * Create one input change handler per text field.
 * @param {(field: EmailSenderTextField, value: string) => void} onFieldChange - Stores the new field value
 * @returns {EmailSenderTextChangeHandlers} - Change handler per text field
 */
export const createTextChangeHandlers = (onFieldChange: (field: EmailSenderTextField, value: string) => void): EmailSenderTextChangeHandlers => {
  /**
   * Create the input change handler of a text field.
   * @param {EmailSenderTextField} field - Text field
   * @returns {(event: ChangeEvent<HTMLInputElement>) => void} - Input change handler
   */
  const createHandler = (field: EmailSenderTextField) => (event: ChangeEvent<HTMLInputElement>): void => {
    onFieldChange(field, event.target.value);
  };

  return {
    name: createHandler("name"),
    email: createHandler("email"),
    smtpHost: createHandler("smtpHost"),
    smtpUsername: createHandler("smtpUsername"),
    smtpPassword: createHandler("smtpPassword"),
  };
};

/**
 * Create one change handler per switch field.
 * @param {(field: EmailSenderToggleField, checked: boolean) => void} onToggle - Stores the new switch value
 * @returns {EmailSenderToggleChangeHandlers} - Change handler per switch field
 */
export const createToggleChangeHandlers = (onToggle: (field: EmailSenderToggleField, checked: boolean) => void): EmailSenderToggleChangeHandlers => {
  /**
   * Create the change handler of a switch field.
   * @param {EmailSenderToggleField} field - Switch field
   * @returns {(checked: boolean) => void} - Switch change handler
   */
  const createHandler = (field: EmailSenderToggleField) => (checked: boolean): void => {
    onToggle(field, checked);
  };

  return {
    enableSsl: createHandler("enableSsl"),
    isDefault: createHandler("isDefault"),
    isActive: createHandler("isActive"),
  };
};
