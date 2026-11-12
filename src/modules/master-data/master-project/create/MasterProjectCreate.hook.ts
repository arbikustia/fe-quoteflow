import type { ChangeEvent, SubmitEvent } from "react";
import { useCallback, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { MASTER_PROJECT_ROUTE } from "../MasterProject.config";

import { PROJECT_FORM_MODE_TEXT, PROJECT_FORM_STEP_FIELDS, PROJECT_FORM_STEPS } from "./MasterProjectCreate.config";
import type {
  MasterProjectCreateController,
  MasterProjectCreateParams,
  ProjectFieldHandlers,
  ProjectFieldHandlersParams,
  ProjectFormStep,
  ProjectFormValues,
  ProjectItemOption,
  ProjectSubmission,
  ProjectValidValues,
  ProjectWizard,
  ProjectWizardParams,
} from "./MasterProjectCreate.type";
import {
  formatApiMessages,
  getAdjacentFormStep,
  getProjectFieldErrors,
  resolveProjectForm,
  sendProjectMutation,
  shouldValidateField,
  toggleSelectedItem,
  updateSelectedItemQuantity,
} from "./MasterProjectCreate.util";

/**
 * Submit the form through the create / update mutation and handle navigation.
 * @param {MasterProjectCreateParams} params - Form mode and mutation triggers
 * @returns {ProjectSubmission} - Submit error, submit and back handlers
 */
const useProjectSubmission = (params: MasterProjectCreateParams): ProjectSubmission => {
  const { id, mode, createProject, updateProject } = params;
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>();

  /**
   * Send the validated form and return to the list on success.
   * @param {ProjectValidValues} values - Valid form values
   * @returns {Promise<void>} - Resolves when the request settles
   */
  const submitProject = useCallback(async (values: ProjectValidValues): Promise<void> => {
    const modeText = PROJECT_FORM_MODE_TEXT[mode];

    setErrorMessage(undefined);

    try {
      const response = await sendProjectMutation(values, { id, createProject, updateProject });

      if (!response.status) {
        setErrorMessage(formatApiMessages(response.messages));

        return;
      }

      navigate(MASTER_PROJECT_ROUTE.LIST, { state: { successMessage: modeText.successMessage } });
    } catch {
      setErrorMessage(modeText.failureMessage);
    }
  }, [createProject, id, mode, navigate, updateProject]);

  /**
   * Navigate back to the project list.
   * @returns {void}
   */
  const handleBack = useCallback((): void => {
    navigate(MASTER_PROJECT_ROUTE.LIST);
  }, [navigate]);

  return { errorMessage, submitProject, handleBack };
};

/**
 * Create the field change handlers of the project form.
 * @param {ProjectFieldHandlersParams} params - react-hook-form accessors and validation state
 * @returns {ProjectFieldHandlers} - Item, name, price, remark and status handlers
 */
const useProjectFieldHandlers = (params: ProjectFieldHandlersParams): ProjectFieldHandlers => {
  const { errors, isSubmitted, getValues, setValue } = params;

  /**
   * Select or unselect an item.
   * @param {ProjectItemOption} item - Item to toggle
   * @returns {void}
   */
  const handleItemToggle = useCallback((item: ProjectItemOption): void => {
    setValue("selectedItems", toggleSelectedItem(getValues("selectedItems"), item), {
      shouldDirty: true,
      shouldValidate: shouldValidateField(isSubmitted, errors, "selectedItems"),
    });
  }, [errors, getValues, isSubmitted, setValue]);

  /**
   * Change the quantity of a selected item.
   * @param {string} itemId - Item to update
   * @param {number} quantity - Requested quantity
   * @returns {void}
   */
  const handleItemQuantityChange = useCallback((itemId: string, quantity: number): void => {
    setValue("selectedItems", updateSelectedItemQuantity(getValues("selectedItems"), itemId, quantity), { shouldDirty: true });
  }, [getValues, setValue]);

  /**
   * Store the name input.
   * @param {ChangeEvent<HTMLInputElement>} event - Name input change event
   * @returns {void}
   */
  const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setValue("name", event.target.value, { shouldDirty: true, shouldValidate: shouldValidateField(isSubmitted, errors, "name") });
  }, [errors, isSubmitted, setValue]);

  /**
   * Store the price input.
   * @param {number | null} price - Entered price, or null when cleared
   * @returns {void}
   */
  const handlePriceChange = useCallback((price: number | null): void => {
    setValue("price", price, { shouldDirty: true, shouldValidate: shouldValidateField(isSubmitted, errors, "price") });
  }, [errors, isSubmitted, setValue]);

  /**
   * Store the remark input.
   * @param {ChangeEvent<HTMLTextAreaElement>} event - Remark textarea change event
   * @returns {void}
   */
  const handleRemarkChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>): void => {
    setValue("remark", event.target.value, { shouldDirty: true });
  }, [setValue]);

  /**
   * Store the active status switch value.
   * @param {boolean} checked - Whether the switch is on
   * @returns {void}
   */
  const handleStatusChange = useCallback((checked: boolean): void => {
    setValue("isActive", checked, { shouldDirty: true });
  }, [setValue]);

  return { handleItemToggle, handleItemQuantityChange, handleNameChange, handlePriceChange, handleRemarkChange, handleStatusChange };
};

/**
 * Manage the wizard step: validate and advance, submit on the last step, go back.
 * @param {ProjectWizardParams} params - Form submit / trigger accessors and the submission
 * @returns {ProjectWizard} - Current step and wizard handlers
 */
const useProjectWizard = (params: ProjectWizardParams): ProjectWizard => {
  const { handleSubmit, trigger, submission } = params;
  const [step, setStep] = useState<ProjectFormStep>(PROJECT_FORM_STEPS[0]);

  /**
   * Validate the current step and move on; on the last step submit the project.
   * @param {SubmitEvent<HTMLFormElement>} event - Form submit event
   * @returns {Promise<void>} - Resolves when validation or submit settles
   */
  const handleFormSubmit = useCallback(async (event: SubmitEvent<HTMLFormElement>): Promise<void> => {
    if (step === "preview") {
      await handleSubmit(submission.submitProject)(event);

      return;
    }

    event.preventDefault();

    if (await trigger(PROJECT_FORM_STEP_FIELDS[step])) {
      setStep(getAdjacentFormStep(step, 1));
    }
  }, [handleSubmit, step, submission.submitProject, trigger]);

  /**
   * Go to the previous step, or leave the form from the first step.
   * @returns {void}
   */
  const handleStepBack = useCallback((): void => {
    if (step === PROJECT_FORM_STEPS[0]) {
      submission.handleBack();

      return;
    }

    setStep(getAdjacentFormStep(step, -1));
  }, [step, submission]);

  return { step, handleFormSubmit, handleStepBack };
};

/**
 * Return a copy of the watched form values so every change yields a new object.
 * @param {ProjectFormValues} formValues - Current form values
 * @returns {ProjectFormValues} - Copy of the form values
 */
const _copyFormValues = (formValues: ProjectFormValues): ProjectFormValues => ({ ...formValues });

/**
 * Manage the project create / edit wizard: step, values, validation, submit and navigation.
 * @param {MasterProjectCreateParams} params - Form mode, initial values and mutation triggers
 * @returns {MasterProjectCreateController} - Form state and handlers
 */
export const useMasterProjectCreate = (params: MasterProjectCreateParams): MasterProjectCreateController => {
  const { control, formState, getValues, handleSubmit, setValue, trigger } = useForm<ProjectFormValues, undefined, ProjectValidValues>({
    defaultValues: params.initialValues,
    values: params.initialValues,
    resetOptions: { keepDirtyValues: true },
    resolver: resolveProjectForm,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const { errors, isSubmitted } = formState;
  const submission = useProjectSubmission(params);
  const wizard = useProjectWizard({ handleSubmit, trigger, submission });
  const fieldHandlers = useProjectFieldHandlers({ errors, isSubmitted, getValues, setValue });

  return {
    step: wizard.step,
    values: useWatch({ control, compute: _copyFormValues }),
    fieldErrors: getProjectFieldErrors(errors),
    errorMessage: submission.errorMessage,
    ...fieldHandlers,
    handleSubmit: wizard.handleFormSubmit,
    handleStepBack: wizard.handleStepBack,
    handleBack: submission.handleBack,
  };
};
