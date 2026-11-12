import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import type { Resolver, UseFormSetValue } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { MASTER_USER_ROUTE } from "../MasterUser.config";

import { USER_FORM_MODE_TEXT } from "./MasterUserCreate.config";
import type {
  MasterUserCreateController,
  MasterUserCreateParams,
  UserFieldHandlers,
  UserFormMode,
  UserFormValues,
  UserSubmission,
  UserTextFieldName,
  UserValidValues,
} from "./MasterUserCreate.type";
import { formatApiMessages, getUserFieldErrors, resolveUserForm, sendUserMutation } from "./MasterUserCreate.util";

/**
 * Submit the form through the create / update mutation and handle navigation.
 * @param {MasterUserCreateParams} params - Form mode and mutation triggers
 * @returns {UserSubmission} - Submit error, submit and back handlers
 */
const useUserSubmission = (params: MasterUserCreateParams): UserSubmission => {
  const { id, mode, createUser, updateUser } = params;
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>();

  /**
   * Send the validated form and return to the list on success.
   * @param {UserValidValues} values - Valid form values
   * @returns {Promise<void>} - Resolves when the request settles
   */
  const submitUser = useCallback(async (values: UserValidValues): Promise<void> => {
    const modeText = USER_FORM_MODE_TEXT[mode];

    setErrorMessage(undefined);

    try {
      const response = await sendUserMutation(values, { id, createUser, updateUser });

      if (!response.status) {
        setErrorMessage(formatApiMessages(response.messages));

        return;
      }

      navigate(MASTER_USER_ROUTE.LIST, { state: { successMessage: modeText.successMessage } });
    } catch {
      setErrorMessage(modeText.failureMessage);
    }
  }, [createUser, id, mode, navigate, updateUser]);

  /**
   * Navigate back to the user list.
   * @returns {void}
   */
  const handleBack = useCallback((): void => {
    navigate(MASTER_USER_ROUTE.LIST);
  }, [navigate]);

  return { errorMessage, submitUser, handleBack };
};

/**
 * Create the field change handlers; text fields re-validate once the form was submitted.
 * @param {UseFormSetValue<UserFormValues>} setValue - react-hook-form setter
 * @param {boolean} isSubmitted - Whether the form was submitted
 * @returns {UserFieldHandlers} - Field change handlers
 */
const useUserFieldHandlers = (setValue: UseFormSetValue<UserFormValues>, isSubmitted: boolean): UserFieldHandlers => {
  /**
   * Create a text input change handler for one field.
   * @param {UserTextFieldName} field - Field to update
   * @returns {(event: ChangeEvent<HTMLInputElement>) => void} - Change handler
   */
  const createTextHandler = useCallback((field: UserTextFieldName) => (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(field, event.target.value, { shouldDirty: true, shouldValidate: isSubmitted });
  }, [isSubmitted, setValue]);

  /**
   * Store the selected role.
   * @param {string} role - Selected role
   * @returns {void}
   */
  const handleRoleChange = useCallback((role: string): void => {
    setValue("role", role, { shouldDirty: true, shouldValidate: isSubmitted });
  }, [isSubmitted, setValue]);

  /**
   * Store the active status switch value.
   * @param {boolean} checked - Whether the switch is on
   * @returns {void}
   */
  const handleStatusChange = useCallback((checked: boolean): void => {
    setValue("isActive", checked, { shouldDirty: true });
  }, [setValue]);

  return {
    handleUsernameChange: createTextHandler("username"),
    handleEmailChange: createTextHandler("email"),
    handlePasswordChange: createTextHandler("password"),
    handleRoleChange,
    handleStatusChange,
  };
};

/**
 * Return a copy of the watched form values so every change yields a new object.
 * @param {UserFormValues} formValues - Current form values
 * @returns {UserFormValues} - Copy of the form values
 */
const _copyFormValues = (formValues: UserFormValues): UserFormValues => ({ ...formValues });

/**
 * Create the react-hook-form resolver of a form mode.
 * @param {UserFormMode} mode - Create or edit mode
 * @returns {Resolver<UserFormValues, undefined, UserValidValues>} - Resolver validating with the mode schema
 */
const _createUserResolver = (mode: UserFormMode): Resolver<UserFormValues, undefined, UserValidValues> => (values) => resolveUserForm(values, mode);

/**
 * Manage the user create / edit form: values, validation, submit and navigation.
 * @param {MasterUserCreateParams} params - Form mode, initial values and mutation triggers
 * @returns {MasterUserCreateController} - Form state and handlers
 */
export const useMasterUserCreate = (params: MasterUserCreateParams): MasterUserCreateController => {
  const { control, formState, handleSubmit, setValue } = useForm<UserFormValues, undefined, UserValidValues>({
    defaultValues: params.initialValues,
    values: params.initialValues,
    resetOptions: { keepDirtyValues: true },
    resolver: _createUserResolver(params.mode),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const submission = useUserSubmission(params);

  /**
   * Show or hide the password.
   * @returns {void}
   */
  const handleTogglePasswordVisibility = useCallback((): void => {
    setIsPasswordVisible((isVisible) => !isVisible);
  }, []);

  return {
    ...useUserFieldHandlers(setValue, formState.isSubmitted),
    values: useWatch({ control, compute: _copyFormValues }),
    fieldErrors: getUserFieldErrors(formState.errors),
    isPasswordVisible,
    errorMessage: submission.errorMessage,
    handleTogglePasswordVisibility,
    handleSubmit: handleSubmit(submission.submitUser),
    handleBack: submission.handleBack,
  };
};
