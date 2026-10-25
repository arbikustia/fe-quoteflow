import type { ChangeEvent, SyntheticEvent } from "react";
import { useEffect, useState } from "react";
import type { UseFormReset } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { CategoryCreateResponse, CategoryData, CategoryDetailResponse } from "@/modules/master-category/MasterCategory.type";
import { mapCategory, useCreateCategoryMutation, useGetCategoryByIdQuery, useUpdateCategoryMutation } from "@/services/master-category.service";

import type { CategoryFormValues, MasterCategoryCreateFormState } from "./MasterCategoryCreate.type";

/**
 * Format backend messages into a display string.
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
 * Hook managing master category create and update form state.
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
  const categoryItem = _resolveCategoryDetail(categoryDetail);
  const { control, formState: { errors }, getValues, register, reset, setValue, trigger } = useForm<CategoryFormValues>({
    defaultValues: {
      name: routeCategory?.categoryName ?? categoryItem?.categoryName ?? "",
      isActive: routeCategory ? routeCategory.status === "active" : categoryItem?.status === "active",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  register("name", { required: "Category name is required." });
  const name = useWatch({ control, name: "name" });
  const isActive = useWatch({ control, name: "isActive" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useCategoryReset(categoryItem, reset);

  /**
   * Handle category name change.
   * @param {ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} event - Name change event
   * @returns {void} No return value
   */
  const handleNameChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setValue("name", event.target.value, { shouldValidate: Boolean(errors.name) });
  };

  /**
   * Toggle category status.
   * @returns {void} No return value
   */
  const handleStatusChange = (): void => { setValue("isActive", !isActive, { shouldDirty: true }); };

  /**
   * Submit category form.
   * @param {SyntheticEvent} event - Form submit event
   * @returns {Promise<void>} Submission result
   */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setIsSubmitted(true);

    if (!(await trigger())) {
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const values = getValues();
      const response: CategoryCreateResponse = isEditMode && id
        ? await updateCategory({ id, category_name: values.name, status: values.isActive ? 1 : 0 }).unwrap()
        : await createCategory({ category_name: values.name, status: 1 }).unwrap();

      if (!response.status) {
        setErrorMessage(_formatMessages(response.messages));

        return;
      }

      const message = isEditMode ? "Category updated successfully." : "Category created successfully.";

      setSuccessMessage(message);
      navigate("/master-category", { state: { successMessage: message } });
    } catch {
      setErrorMessage(isEditMode ? "Unable to update category. Please try again." : "Unable to create category. Please try again.");
    }
  };

  /**
   * Go back.
   * @returns {void} No return value
   */
  const goBack = (): void => { navigate(-1); };

  return {
    name,
    isActive,
    isEditMode,
    isLoadingInitialData: isLoadingDetail && !routeCategory,
    isSubmitting: isCreating || isUpdating,
    errorMessage,
    successMessage,
    errors,
    isSubmitted,
    handleNameChange,
    handleStatusChange,
    handleSubmit,
    goBack,
  };
};
