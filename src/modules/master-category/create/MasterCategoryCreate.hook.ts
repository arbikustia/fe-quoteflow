import type { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { CategoryCreateResponse, CategoryData, CategoryDetailResponse } from "@/modules/master-category/MasterCategory.type";
import { mapCategory, useCreateCategoryMutation, useGetCategoryByIdQuery, useUpdateCategoryMutation } from "@/services/master-category.service";

import type { CategorySubmissionParams, CategorySubmissionState, MasterCategoryCreateFormState } from "./MasterCategoryCreate.type";

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
 * Create input change handler.
 * @param {Dispatch<SetStateAction<string>>} setter - State setter
 * @returns {(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} Change handler
 */
const _useInputChange = (setter: Dispatch<SetStateAction<string>>): ((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) => (
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => { setter(event.target.value); }
);

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
 * Hook managing category form fields.
 * @param {CategoryData | undefined} routeCategory - Category from route state
 * @param {CategoryData | null} categoryItem - Category from API
 * @returns {{ readonly name: string; readonly isActive: boolean; readonly handleNameChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; readonly handleStatusChange: () => void }} Form fields
 */
const useCategoryFormFields = (routeCategory: CategoryData | undefined, categoryItem: CategoryData | null): {
  readonly name: string;
  readonly isActive: boolean;
  readonly handleNameChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readonly handleStatusChange: () => void;
} => {
  const [name, setName] = useState(routeCategory?.categoryName ?? categoryItem?.categoryName ?? "");
  const [isActive, setIsActive] = useState(routeCategory ? routeCategory.status === "active" : categoryItem?.status === "active");
  const [initializedId, setInitializedId] = useState<string | null>(routeCategory?.id ?? null);

  if (categoryItem && categoryItem.id !== initializedId) {
    setInitializedId(categoryItem.id);
    setName(categoryItem.categoryName);
    setIsActive(categoryItem.status === "active");
  }

  const handleNameChange = _useInputChange(setName);
  const handleStatusChange = (): void => { setIsActive((currentIsActive) => !currentIsActive); };

  return { name, isActive, handleNameChange, handleStatusChange };
};

/**
 * Hook managing category submission.
 * @param {CategorySubmissionParams} params - Submission parameters
 * @returns {CategorySubmissionState} Submission state
 */
const useCategorySubmission = (params: CategorySubmissionParams): CategorySubmissionState => {
  const { id, isEditMode, name, isActive } = params;
  const navigate = useNavigate();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isSubmitting = isCreating || isUpdating;

  /**
   * Submit category form.
   * @param {SyntheticEvent} event - Form submit event
   * @returns {Promise<void>} Submission result
   */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrorMessage("Category name is required.");

      return;
    }

    try {
      const response: CategoryCreateResponse = isEditMode && id
        ? await updateCategory({ id, category_name: name, status: isActive ? 1 : 0 }).unwrap()
        : await createCategory({ category_name: name, status: 1 }).unwrap();

      if (!response.status) {
        setErrorMessage(_formatMessages(response.messages));

        return;
      }

      setSuccessMessage(isEditMode ? "Category updated successfully." : "Category created successfully.");
      navigate("/master-category");
    } catch {
      setErrorMessage(isEditMode ? "Unable to update category. Please try again." : "Unable to create category. Please try again.");
    }
  };

  return { isSubmitting, errorMessage, successMessage, handleSubmit };
};

/**
 * Hook managing master category create and update form state.
 * @returns {MasterCategoryCreateFormState} Form state and handlers
 */
export const useMasterCategoryCreate = (): MasterCategoryCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ readonly id?: string }>();
  const isEditMode = Boolean(id);
  const routeCategory: CategoryData | undefined = location.state?.category;
  const { data: categoryDetail } = useGetCategoryByIdQuery(id ?? "", { skip: !isEditMode || !id || Boolean(routeCategory) });
  const categoryItem = _resolveCategoryDetail(categoryDetail);
  const { name, isActive, handleNameChange, handleStatusChange } = useCategoryFormFields(routeCategory, categoryItem);
  const submission = useCategorySubmission({ id, isEditMode, name, isActive });

  /**
   * Go back.
   * @returns {void} No return value
   */
  const goBack = (): void => { navigate(-1); };

  return { name, isActive, isEditMode, goBack, handleNameChange, handleStatusChange, ...submission };
};
