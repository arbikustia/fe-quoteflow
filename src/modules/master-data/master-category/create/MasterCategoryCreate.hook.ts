import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { MASTER_CATEGORY_ROUTE } from "../MasterCategory.config";

import { CATEGORY_FORM_MODE_TEXT } from "./MasterCategoryCreate.config";
import type { CategoryFormValues, CategorySubmission, MasterCategoryCreateController, MasterCategoryCreateParams } from "./MasterCategoryCreate.type";
import { formatApiMessages, resolveCategoryForm, sendCategoryMutation } from "./MasterCategoryCreate.util";

/**
 * Submit the form through the create / update mutation and handle navigation.
 * @param {MasterCategoryCreateParams} params - Form mode and mutation triggers
 * @returns {CategorySubmission} - Submit error, submit and back handlers
 */
const useCategorySubmission = (params: MasterCategoryCreateParams): CategorySubmission => {
  const { id, mode, createCategory, updateCategory } = params;
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>();

  /**
   * Send the validated form and return to the list on success.
   * @param {CategoryFormValues} values - Valid form values
   * @returns {Promise<void>} - Resolves when the request settles
   */
  const submitCategory = useCallback(async (values: CategoryFormValues): Promise<void> => {
    const modeText = CATEGORY_FORM_MODE_TEXT[mode];

    setErrorMessage(undefined);

    try {
      const response = await sendCategoryMutation(values, { id, createCategory, updateCategory });

      if (!response.status) {
        setErrorMessage(formatApiMessages(response.messages));

        return;
      }

      navigate(MASTER_CATEGORY_ROUTE.LIST, { state: { successMessage: modeText.successMessage } });
    } catch {
      setErrorMessage(modeText.failureMessage);
    }
  }, [createCategory, id, mode, navigate, updateCategory]);

  /**
   * Navigate back to the category list.
   * @returns {void}
   */
  const handleBack = useCallback((): void => {
    navigate(MASTER_CATEGORY_ROUTE.LIST);
  }, [navigate]);

  return { errorMessage, submitCategory, handleBack };
};

/**
 * Manage the category create / edit form: values, validation, submit and navigation.
 * @param {MasterCategoryCreateParams} params - Form mode, initial values and mutation triggers
 * @returns {MasterCategoryCreateController} - Form state and handlers
 */
export const useMasterCategoryCreate = (params: MasterCategoryCreateParams): MasterCategoryCreateController => {
  const { control, formState, handleSubmit, setValue } = useForm<CategoryFormValues>({
    defaultValues: params.initialValues,
    values: params.initialValues,
    resetOptions: { keepDirtyValues: true },
    resolver: resolveCategoryForm,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const { isSubmitted } = formState;
  const submission = useCategorySubmission(params);

  /**
   * Handle category name input; re-validates once the form was submitted.
   * @param {ChangeEvent<HTMLInputElement>} event - Input change event
   * @returns {void}
   */
  const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setValue("name", event.target.value, { shouldDirty: true, shouldValidate: isSubmitted });
  }, [isSubmitted, setValue]);

  /**
   * Handle the active status switch.
   * @param {boolean} isActive - Whether the category is active
   * @returns {void}
   */
  const handleStatusChange = useCallback((isActive: boolean): void => {
    setValue("isActive", isActive, { shouldDirty: true });
  }, [setValue]);

  return {
    values: { name: useWatch({ control, name: "name" }), isActive: useWatch({ control, name: "isActive" }) },
    nameError: formState.errors.name?.message,
    errorMessage: submission.errorMessage,
    handleNameChange,
    handleStatusChange,
    handleSubmit: handleSubmit(submission.submitCategory),
    handleBack: submission.handleBack,
  };
};
