import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { MASTER_ROLE_ROUTE } from "../MasterRole.config";

import { ROLE_FORM_MODE_TEXT } from "./MasterRoleCreate.config";
import type {
  MasterRoleCreateController,
  MasterRoleCreateParams,
  RoleFormValues,
  RoleSubmission,
  RoleValidValues,
} from "./MasterRoleCreate.type";
import { formatApiMessages, getRoleFieldErrors, resolveRoleForm, sendRoleMutation } from "./MasterRoleCreate.util";

/**
 * Submit the form through the create / update mutation and handle navigation.
 * @param {MasterRoleCreateParams} params - Form mode and mutation triggers
 * @returns {RoleSubmission} - Submit error, submit and back handlers
 */
const useRoleSubmission = (params: MasterRoleCreateParams): RoleSubmission => {
  const { id, mode, createRole, updateRole } = params;
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>();

  /**
   * Send the validated form and return to the list on success.
   * @param {RoleValidValues} values - Valid form values
   * @returns {Promise<void>} - Resolves when the request settles
   */
  const submitRole = useCallback(async (values: RoleValidValues): Promise<void> => {
    const modeText = ROLE_FORM_MODE_TEXT[mode];

    setErrorMessage(undefined);

    try {
      const response = await sendRoleMutation(values, { id, createRole, updateRole });

      if (!response.status) {
        setErrorMessage(formatApiMessages(response.messages));

        return;
      }

      navigate(MASTER_ROLE_ROUTE.LIST, { state: { successMessage: modeText.successMessage } });
    } catch {
      setErrorMessage(modeText.failureMessage);
    }
  }, [createRole, id, mode, navigate, updateRole]);

  /**
   * Navigate back to the role list.
   * @returns {void}
   */
  const handleBack = useCallback((): void => {
    navigate(MASTER_ROLE_ROUTE.LIST);
  }, [navigate]);

  return { errorMessage, submitRole, handleBack };
};

/**
 * Return a copy of the watched form values so every change yields a new object.
 * @param {RoleFormValues} formValues - Current form values
 * @returns {RoleFormValues} - Copy of the form values
 */
const _copyFormValues = (formValues: RoleFormValues): RoleFormValues => ({ ...formValues });

/**
 * Manage the role create / edit form: values, validation, submit and navigation.
 * @param {MasterRoleCreateParams} params - Form mode, initial values and mutation triggers
 * @returns {MasterRoleCreateController} - Form state and handlers
 */
export const useMasterRoleCreate = (params: MasterRoleCreateParams): MasterRoleCreateController => {
  const { control, formState, handleSubmit, setValue } = useForm<RoleFormValues, undefined, RoleValidValues>({
    defaultValues: params.initialValues,
    values: params.initialValues,
    resetOptions: { keepDirtyValues: true },
    resolver: resolveRoleForm,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const { isSubmitted } = formState;
  const submission = useRoleSubmission(params);

  /**
   * Store the name input; re-validates once the form was submitted.
   * @param {ChangeEvent<HTMLInputElement>} event - Name input change event
   * @returns {void}
   */
  const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setValue("name", event.target.value, { shouldDirty: true, shouldValidate: isSubmitted });
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
    values: useWatch({ control, compute: _copyFormValues }),
    fieldErrors: getRoleFieldErrors(formState.errors),
    errorMessage: submission.errorMessage,
    handleNameChange,
    handleStatusChange,
    handleSubmit: handleSubmit(submission.submitRole),
    handleBack: submission.handleBack,
  };
};
