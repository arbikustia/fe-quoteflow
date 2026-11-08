import type { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { EmailSender, EmailSenderFormState, EmailSenderMutationResponse, EmailSenderPayload } from "./EmailSender.type";
import type { EmailSenderCreateProps, EmailSenderFieldErrors, EmailSenderSubmitContext } from "./EmailSenderCreate.type";

import { useCreateEmailSenderMutation, useUpdateEmailSenderMutation } from "@/services/email-sender.service";

const initial: EmailSenderFormState = {
  name: "",
  email: "",
  smtp_host: "",
  smtp_port: 587,
  smtp_username: "",
  smtp_password: "",
  enable_ssl: true,
  is_default: false,
  status: 1,
};

/**
 * Map an existing sender into editable form state.
 *
 * @param {EmailSender} sender - Loaded sender
 * @returns {EmailSenderFormState} Form state
 */
const toForm = (sender: EmailSender): EmailSenderFormState => ({ ...sender, smtp_password: "" });

/**
 * Validate required sender fields.
 *
 * @param {EmailSenderFormState} form - Current form state
 * @param {boolean} isEditMode - Whether editing an existing sender
 * @returns {EmailSenderFieldErrors} Field error map
 */
const _validateForm = (form: EmailSenderFormState, isEditMode: boolean): EmailSenderFieldErrors => ({
  ...(!form.name.trim() && { name: "Name is required." }),
  ...(!form.email.trim() && { email: "Email is required." }),
  ...(!form.smtp_host.trim() && { smtp_host: "SMTP Host is required." }),
  ...(!form.smtp_port && { smtp_port: "SMTP Port is required." }),
  ...(!form.smtp_username.trim() && { smtp_username: "SMTP Username is required." }),
  ...(!isEditMode && !form.smtp_password.trim() && { smtp_password: "SMTP Password is required." }),
});

/**
 * Resolve the route state into initial form state.
 *
 * @param {EmailSender | undefined} routeSender - Sender passed through navigation
 * @returns {EmailSenderFormState} Initial form state
 */
const _resolveInitialForm = (routeSender: EmailSender | undefined): EmailSenderFormState =>
  (routeSender ? toForm(routeSender) : initial);

/**
 * Persist the sender through the create or update mutation.
 *
 * @param {string | undefined} id - Sender ID when editing
 * @param {EmailSenderFormState} form - Current form state
 * @param {(payload: EmailSenderPayload) => { unwrap: () => Promise<EmailSenderMutationResponse> }} create - Create mutation
 * @param {(payload: EmailSenderPayload & { id: string }) => { unwrap: () => Promise<EmailSenderMutationResponse> }} update - Update mutation
 * @returns {Promise<void>} Resolves after the mutation settles
 */
const _sendSenderMutation = async (
  id: string | undefined,
  form: EmailSenderFormState,
  create: (payload: EmailSenderPayload) => { unwrap: () => Promise<EmailSenderMutationResponse> },
  update: (payload: EmailSenderPayload & { id: string }) => { unwrap: () => Promise<EmailSenderMutationResponse> },
): Promise<void> => {
  if (id) {
    await update({ ...form, id }).unwrap();

    return;
  }

  await create({ ...form, status: 1 }).unwrap();
};

/**
 * Build the field handlers bound to the current form state.
 *
 * @param {EmailSenderFormState} form - Current form state
 * @param {(next: EmailSenderFormState) => void} setForm - Form state setter
 * @param {(next: EmailSenderFieldErrors) => void} setFieldErrors - Field error setter
 * @returns {Pick<EmailSenderCreateProps, "onChange" | "onPortChange" | "onSslChange" | "onDefaultChange" | "onStatusChange">} Field handlers
 */
const _buildFieldHandlers = (
  form: EmailSenderFormState,
  setForm: Dispatch<SetStateAction<EmailSenderFormState>>,
  setFieldErrors: Dispatch<SetStateAction<EmailSenderFieldErrors>>,
): Pick<EmailSenderCreateProps, "onChange" | "onPortChange" | "onSslChange" | "onDefaultChange" | "onStatusChange"> => {
  /**
   * Create a bound change handler for one form field.
   *
   * @param {keyof EmailSenderFormState} key - Field key
   * @returns {(event: ChangeEvent<HTMLInputElement>) => void} Bound change handler
   */
  const onChange = (key: keyof EmailSenderFormState) => (event: ChangeEvent<HTMLInputElement>): void => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setFieldErrors({});
  };

  /**
   * Update the SMTP port field.
   *
   * @param {number | null} smtp_port - Selected port
   * @returns {void} No return value
   */
  const onPortChange = (smtp_port: number | null): void => setForm((current) => ({ ...current, smtp_port: smtp_port ?? 0 }));

  /**
   * Update the SSL flag.
   *
   * @param {boolean} enable_ssl - Whether SSL is enabled
   * @returns {void} No return value
   */
  const onSslChange = (enable_ssl: boolean): void => setForm((current) => ({ ...current, enable_ssl }));

  /**
   * Update the default sender flag.
   *
   * @param {boolean} is_default - Whether this sender is the default
   * @returns {void} No return value
   */
  const onDefaultChange = (is_default: boolean): void => setForm((current) => ({ ...current, is_default }));

  /**
   * Update the active status.
   *
   * @param {boolean} isActive - Whether the sender is active
   * @returns {void} No return value
   */
  const onStatusChange = (isActive: boolean): void => setForm((current) => ({ ...current, status: isActive ? 1 : 0 }));

  return { onChange, onPortChange, onSslChange, onDefaultChange, onStatusChange };
};


/**
 * Resolve the success toast message for the current mode.
 *
 * @param {boolean} isEditMode - Whether editing an existing sender
 * @returns {string} Success message
 */
const _successMessage = (isEditMode: boolean): string =>
  (isEditMode ? "Email sender updated successfully." : "Email sender created successfully.");

/**
 * Resolve the failure message for the current mode.
 *
 * @param {boolean} isEditMode - Whether editing an existing sender
 * @returns {string} Failure message
 */
const _failureMessage = (isEditMode: boolean): string =>
  (isEditMode ? "Unable to update email sender." : "Unable to create email sender.");

/**
 * Validate the form and publish field errors.
 *
 * @param {EmailSenderFormState} form - Current form state
 * @param {boolean} isEditMode - Whether editing an existing sender
 * @param {(next: EmailSenderFieldErrors) => void} setFieldErrors - Field error setter
 * @returns {boolean} Whether the form is valid
 */
const _validateAndReport = (
  form: EmailSenderFormState,
  isEditMode: boolean,
  setFieldErrors: (next: EmailSenderFieldErrors) => void,
): boolean => {
  const validationErrors = _validateForm(form, isEditMode);

  setFieldErrors(validationErrors);

  return Object.keys(validationErrors).length === 0;
};

/**
 * Build the submit handler for the sender form.
 *
 * @param {EmailSenderSubmitContext} context - Bound submit context
 * @param {Dispatch<SetStateAction<boolean>>} setSubmitting - Local pending state setter
 * @returns {(event: SyntheticEvent) => void} Submit handler
 */
const _createSubmitHandler = (
  context: EmailSenderSubmitContext,
  setSubmitting: Dispatch<SetStateAction<boolean>>,
) => (event: SyntheticEvent): void => {
  event.preventDefault();
  context.setErrorMessage(null);

  if (!_validateAndReport(context.form, context.isEditMode, context.setFieldErrors)) return;

  setSubmitting(true);
  void _submitSender(context, setSubmitting);
};

/**
 * Send the validated form and report success or failure.
 *
 * @param {EmailSenderSubmitContext} context - Bound submit context
 * @param {Dispatch<SetStateAction<boolean>>} setSubmitting - Local pending state setter
 * @returns {Promise<void>} Resolves when submission finishes
 */
const _submitSender = async (
  context: EmailSenderSubmitContext,
  setSubmitting: Dispatch<SetStateAction<boolean>>,
): Promise<void> => {
  try {
    await _sendSenderMutation(context.id, context.form, context.create, context.update);
    context.navigate("/master-email-sender", { state: { successMessage: _successMessage(context.isEditMode) } });
  } catch {
    context.setErrorMessage(_failureMessage(context.isEditMode));
  } finally {
    setSubmitting(false);
  }
};

/**
 * Provide master email sender create/edit form state.
 *
 * @returns {EmailSenderCreateProps} Form props
 */
export const useEmailSenderCreate = (): EmailSenderCreateProps => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const routeSender = useLocation().state?.emailSender as EmailSender | undefined;
  const isEditMode = Boolean(id);
  const [form, setForm] = useState<EmailSenderFormState>(_resolveInitialForm(routeSender));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<EmailSenderFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [create, createState] = useCreateEmailSenderMutation();
  const [update, updateState] = useUpdateEmailSenderMutation();
  const onSubmit = _createSubmitHandler(
    { id, form, isEditMode, create, update, navigate, setErrorMessage, setFieldErrors },
    setIsSubmitting,
  );

  /**
   * Navigate back to the sender list.
   *
   * @returns {void} No return value
   */
  const onBack = (): void => {
    navigate("/master-email-sender");
  };

  return {
    ...form,
    isEditMode,
    isSubmitting: isSubmitting || createState.isLoading || updateState.isLoading,
    errorMessage,
    fieldErrors,
    onSubmit,
    onBack,
    ..._buildFieldHandlers(form, setForm, setFieldErrors),
  };
};
