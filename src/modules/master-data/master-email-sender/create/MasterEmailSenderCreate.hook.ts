import { useCallback, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { MASTER_EMAIL_SENDER_ROUTE } from "../MasterEmailSender.config";

import { EMAIL_SENDER_FORM_MODE_TEXT } from "./MasterEmailSenderCreate.config";
import type {
  EmailSenderFormValues,
  EmailSenderSubmission,
  EmailSenderTextField,
  EmailSenderToggleField,
  EmailSenderValidValues,
  MasterEmailSenderCreateController,
  MasterEmailSenderCreateParams,
} from "./MasterEmailSenderCreate.type";
import {
  createEmailSenderResolver,
  createTextChangeHandlers,
  createToggleChangeHandlers,
  formatApiMessages,
  getEmailSenderFieldErrors,
  sendEmailSenderMutation,
} from "./MasterEmailSenderCreate.util";

/**
 * Submit the form through the create / update mutation and handle navigation.
 * @param {MasterEmailSenderCreateParams} params - Form mode and mutation triggers
 * @returns {EmailSenderSubmission} - Submit error, submit and back handlers
 */
const useEmailSenderSubmission = (params: MasterEmailSenderCreateParams): EmailSenderSubmission => {
  const { id, mode, createEmailSender, updateEmailSender } = params;
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>();

  /**
   * Send the validated form and return to the list on success.
   * @param {EmailSenderValidValues} values - Valid form values
   * @returns {Promise<void>} - Resolves when the request settles
   */
  const submitEmailSender = useCallback(async (values: EmailSenderValidValues): Promise<void> => {
    const modeText = EMAIL_SENDER_FORM_MODE_TEXT[mode];

    setErrorMessage(undefined);

    try {
      const response = await sendEmailSenderMutation(values, { id, createEmailSender, updateEmailSender });

      if (!response.status) {
        setErrorMessage(formatApiMessages(response.messages));

        return;
      }

      navigate(MASTER_EMAIL_SENDER_ROUTE.LIST, { state: { successMessage: modeText.successMessage } });
    } catch {
      setErrorMessage(modeText.failureMessage);
    }
  }, [createEmailSender, id, mode, navigate, updateEmailSender]);

  /**
   * Navigate back to the email sender list.
   * @returns {void}
   */
  const handleBack = useCallback((): void => {
    navigate(MASTER_EMAIL_SENDER_ROUTE.LIST);
  }, [navigate]);

  return { errorMessage, submitEmailSender, handleBack };
};

/**
 * Return a copy of the watched form values so every change yields a new object.
 * @param {EmailSenderFormValues} formValues - Current form values
 * @returns {EmailSenderFormValues} - Copy of the form values
 */
const _copyFormValues = (formValues: EmailSenderFormValues): EmailSenderFormValues => ({ ...formValues });

/**
 * Manage the email sender create / edit form: values, validation, submit and navigation.
 * @param {MasterEmailSenderCreateParams} params - Form mode, initial values and mutation triggers
 * @returns {MasterEmailSenderCreateController} - Form state and handlers
 */
export const useMasterEmailSenderCreate = (params: MasterEmailSenderCreateParams): MasterEmailSenderCreateController => {
  const resolver = useMemo(() => createEmailSenderResolver(params.mode), [params.mode]);
  const { control, formState, handleSubmit, setValue } = useForm<EmailSenderFormValues, undefined, EmailSenderValidValues>({
    defaultValues: params.initialValues,
    values: params.initialValues,
    resetOptions: { keepDirtyValues: true },
    resolver,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const { isSubmitted } = formState;
  const submission = useEmailSenderSubmission(params);

  /**
   * Store an input value; re-validates once the form was submitted.
   * @param {EmailSenderTextField | "smtpPort"} field - Field to update
   * @param {string | number | null} value - New value
   * @returns {void}
   */
  const handleFieldChange = useCallback((field: EmailSenderTextField | "smtpPort", value: string | number | null): void => {
    setValue(field, value, { shouldDirty: true, shouldValidate: isSubmitted });
  }, [isSubmitted, setValue]);

  /**
   * Handle the SMTP port input.
   * @param {number | null} value - Port, or null when the input is empty
   * @returns {void}
   */
  const handlePortChange = useCallback((value: number | null): void => {
    handleFieldChange("smtpPort", value);
  }, [handleFieldChange]);

  /**
   * Store a switch value.
   * @param {EmailSenderToggleField} field - Switch field
   * @param {boolean} checked - Whether the switch is on
   * @returns {void}
   */
  const handleToggle = useCallback((field: EmailSenderToggleField, checked: boolean): void => {
    setValue(field, checked, { shouldDirty: true });
  }, [setValue]);

  return {
    values: useWatch({ control, compute: _copyFormValues }),
    fieldErrors: getEmailSenderFieldErrors(formState.errors),
    errorMessage: submission.errorMessage,
    handleTextChange: useMemo(() => createTextChangeHandlers(handleFieldChange), [handleFieldChange]),
    handlePortChange,
    handleToggleChange: useMemo(() => createToggleChangeHandlers(handleToggle), [handleToggle]),
    handleSubmit: handleSubmit(submission.submitEmailSender),
    handleBack: submission.handleBack,
  };
};
