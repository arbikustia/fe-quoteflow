import type { ChangeEvent, SyntheticEvent } from "react";
import { useEffect, useState } from "react";
import type { FieldError, UseFormReset, UseFormSetValue } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { CategoryActionsContext, CategoryFormFields, CategoryFormValues, CategorySubmissionContext, CategorySubmitParams, MasterCategoryCreateFormState } from "./MasterCategoryCreate.type";

import type { CategoryCreateResponse, CategoryData, CategoryDetailResponse } from "@/modules/master-data/master-category/MasterCategory.type";
import { mapCategory, useCreateCategoryMutation, useGetCategoryByIdQuery, useUpdateCategoryMutation } from "@/services/master-category.service";

/**
 * Format backend messages into a display string.
 *
 * @param {string[] | string | null} messages - Backend response messages
 * @returns {string} Display message
 */
const _formatMessages = (messages: string[] | string | null): string => {
  if (Array.isArray(messages)) {
    return messages.join(" ");
  }

  return messages ?? "Category request failed.";
};

/**
 * Resolve category detail response.
 *
 * @param {CategoryDetailResponse | undefined} response - API response
 * @returns {CategoryData | null} Category data or null
 */
const _resolveCategoryDetail = (response: CategoryDetailResponse | undefined): CategoryData | null => {
  if (!response?.status || !response.data) {
    return null;
  }

  return mapCategory(response.data);
};

/**
 * Reset form when API category arrives.
 *
 * @param {CategoryData | null} categoryItem - Category from API
 * @param {UseFormReset<CategoryFormValues>} reset - Form reset function
 * @returns {void} No return value
 */
const useCategoryReset = (categoryItem: CategoryData | null, reset: UseFormReset<CategoryFormValues>): void => {
  useEffect((): void => {
    if (categoryItem) {
      reset({ name: categoryItem.categoryName, isActive: categoryItem.status === "active" });
    }
  }, [categoryItem, reset]);
};

/**
 * Persist the category through create or update mutation.
 *
 * @param {CategorySubmitParams} params - Submission parameters
 * @returns {Promise<CategoryCreateResponse>} Mutation response
 */
const _sendCategoryMutation = (params: CategorySubmitParams): Promise<CategoryCreateResponse> => {
  const values = params.getValues();

  if (params.isEditMode && params.id) {
    return params.updateCategory({ id: params.id, category_name: values.name, status: values.isActive ? 1 : 0 }).unwrap();
  }

  return params.createCategory({ category_name: values.name, status: 1 }).unwrap();
};

/**
 * Submit the category form and report the result.
 *
 * @param {CategorySubmissionContext} context - Bound submission context
 * @returns {Promise<void>} Resolves after submission settles
 */
const _submitCategory = async (context: CategorySubmissionContext): Promise<void> => {
  context.setIsSubmitted(true);

  if (!(await context.trigger())) return;

  context.setErrorMessage(null);
  context.setSuccessMessage(null);

  try {
    const response = await _sendCategoryMutation(context.params);

    if (!response.status) {
      context.setErrorMessage(_formatMessages(response.messages));

      return;
    }

    const message = context.params.isEditMode ? "Category updated successfully." : "Category created successfully.";

    context.setSuccessMessage(message);
    context.navigate("/master-category", { state: { successMessage: message } });
  } catch {
    context.setErrorMessage(context.params.isEditMode ? "Unable to update category. Please try again." : "Unable to create category. Please try again.");
  }
};

/**
 * Create the category name change handler.
 *
 * @param {UseFormSetValue<CategoryFormValues>} setValue - Form value setter
 * @param {FieldError | undefined} error - Current name field error
 * @returns {(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} Name change handler
 */
const _createNameChange =
  (setValue: UseFormSetValue<CategoryFormValues>, error: FieldError | undefined) =>
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setValue("name", event.target.value, { shouldValidate: Boolean(error) });
  };

/**
 * Wire the category form fields.
 *
 * @param {CategoryData | undefined} routeCategory - Category passed through navigation
 * @param {CategoryData | null} categoryItem - Category loaded from API
 * @returns {CategoryFormFields} Form field state
 */
const useCategoryFormFields = (
  routeCategory: CategoryData | undefined,
  categoryItem: CategoryData | null,
): CategoryFormFields => {
  const { control, formState: { errors }, getValues, register, reset, setValue, trigger } = useForm<CategoryFormValues>({
    defaultValues: {
      name: routeCategory?.categoryName ?? categoryItem?.categoryName ?? "",
      isActive: routeCategory ? routeCategory.status === "active" : categoryItem?.status === "active",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  register("name", { required: "Category name is required." });
  useCategoryReset(categoryItem, reset);

  return {
    name: useWatch({ control, name: "name" }),
    isActive: useWatch({ control, name: "isActive" }),
    errors,
    getValues,
    setValue,
    trigger,
  };
};

/**
 * Build the status, submit, and back handlers.
 *
 * @param {CategoryActionsContext} context - Bound action context
 * @returns {Pick<MasterCategoryCreateFormState, "handleStatusChange" | "handleSubmit" | "goBack">} Actions
 */
const _buildActions = (
  context: CategoryActionsContext,
): Pick<MasterCategoryCreateFormState, "handleStatusChange" | "handleSubmit" | "goBack"> => {
  /**
   * Toggle category status.
   *
   * @returns {void} No return value
   */
  const handleStatusChange = (): void => {
    context.fields.setValue("isActive", !context.fields.isActive, { shouldDirty: true });
  };

  /**
   * Go back to the category list.
   *
   * @returns {void} No return value
   */
  const goBack = (): void => {
    context.navigate("/master-category");
  };

  /**
   * Submit category form.
   *
   * @param {SyntheticEvent} event - Form submit event
   * @returns {Promise<void>} Submission result
   */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();

    await _submitCategory({
      params: {
        id: context.id,
        isEditMode: context.isEditMode,
        getValues: context.fields.getValues,
        createCategory: context.createCategory,
        updateCategory: context.updateCategory,
      },
      trigger: context.fields.trigger,
      navigate: context.navigate,
      setIsSubmitted: context.setIsSubmitted,
      setErrorMessage: context.setErrorMessage,
      setSuccessMessage: context.setSuccessMessage,
    });
  };

  return { handleStatusChange, handleSubmit, goBack };
};

/**
 * Hook managing master category create and update form state.
 *
 * @returns {MasterCategoryCreateFormState} Form state and handlers
 */
export const useMasterCategoryCreate = (): MasterCategoryCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const routeCategory: CategoryData | undefined = location.state?.category;
  const { data: categoryDetail, isLoading: isLoadingDetail } = useGetCategoryByIdQuery(id ?? "", {
    skip: !isEditMode || !id || Boolean(routeCategory),
  });
  const fields = useCategoryFormFields(routeCategory, _resolveCategoryDetail(categoryDetail));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const actions = _buildActions({ fields, id, isEditMode, createCategory, updateCategory, navigate, setIsSubmitted, setErrorMessage, setSuccessMessage });

  return {
    name: fields.name,
    isActive: fields.isActive,
    isEditMode,
    isLoadingInitialData: isLoadingDetail && !routeCategory,
    isSubmitting: isCreating || isUpdating,
    errorMessage,
    successMessage,
    errors: fields.errors,
    isSubmitted,
    handleNameChange: _createNameChange(fields.setValue, fields.errors.name),
    ...actions,
  };
};
