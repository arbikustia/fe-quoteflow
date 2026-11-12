import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { MASTER_PIC_ROUTE } from "../MasterPic.config";

import { PIC_FORM_MODE_TEXT } from "./MasterPicCreate.config";
import type {
  MasterPicCreateController,
  MasterPicCreateParams,
  PicFormValues,
  PicSubmission,
  PicValidValues,
} from "./MasterPicCreate.type";
import { formatApiMessages, getPicFieldErrors, resolvePicForm, sendPicMutation } from "./MasterPicCreate.util";

/**
 * Submit the form through the create / update mutation and handle navigation.
 * @param {MasterPicCreateParams} params - Form mode and mutation triggers
 * @returns {PicSubmission} - Submit error, submit and back handlers
 */
const usePicSubmission = (params: MasterPicCreateParams): PicSubmission => {
  const { id, mode, createPic, updatePic } = params;
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>();

  /**
   * Send the validated form and return to the list on success.
   * @param {PicValidValues} values - Valid form values
   * @returns {Promise<void>} - Resolves when the request settles
   */
  const submitPic = useCallback(async (values: PicValidValues): Promise<void> => {
    const modeText = PIC_FORM_MODE_TEXT[mode];

    setErrorMessage(undefined);

    try {
      const response = await sendPicMutation(values, { id, createPic, updatePic });

      if (!response.status) {
        setErrorMessage(formatApiMessages(response.messages));

        return;
      }

      navigate(MASTER_PIC_ROUTE.LIST, { state: { successMessage: modeText.successMessage } });
    } catch {
      setErrorMessage(modeText.failureMessage);
    }
  }, [createPic, id, mode, navigate, updatePic]);

  /**
   * Navigate back to the PIC list.
   * @returns {void}
   */
  const handleBack = useCallback((): void => {
    navigate(MASTER_PIC_ROUTE.LIST);
  }, [navigate]);

  return { errorMessage, submitPic, handleBack };
};

/**
 * Return a copy of the watched form values so every change yields a new object.
 * @param {PicFormValues} formValues - Current form values
 * @returns {PicFormValues} - Copy of the form values
 */
const _copyFormValues = (formValues: PicFormValues): PicFormValues => ({ ...formValues });

/**
 * Manage the PIC create / edit form: values, validation, submit and navigation.
 * @param {MasterPicCreateParams} params - Form mode, initial values and mutation triggers
 * @returns {MasterPicCreateController} - Form state and handlers
 */
export const useMasterPicCreate = (params: MasterPicCreateParams): MasterPicCreateController => {
  const { control, formState, handleSubmit, setValue } = useForm<PicFormValues, undefined, PicValidValues>({
    defaultValues: params.initialValues,
    values: params.initialValues,
    resetOptions: { keepDirtyValues: true },
    resolver: resolvePicForm,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const { isSubmitted } = formState;
  const submission = usePicSubmission(params);

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
    fieldErrors: getPicFieldErrors(formState.errors),
    errorMessage: submission.errorMessage,
    handleNameChange,
    handleStatusChange,
    handleSubmit: handleSubmit(submission.submitPic),
    handleBack: submission.handleBack,
  };
};
