import type { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { CategoryCreateResponse } from "@/modules/master-category/MasterCategory.type";
import { useCreateCategoryMutation, useUpdateCategoryMutation } from "@/services/master-category.service";

import type { MasterCategoryCreateFormState } from "./MasterCategoryCreate.type";

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
 * Hook managing master category create and update form state.
 * @returns {MasterCategoryCreateFormState} Form state and handlers
 */
export const useMasterCategoryCreate = (): MasterCategoryCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ readonly id?: string }>();
  const isEditMode = Boolean(id);
  const routeCategory = location.state?.category;
  const [name, setName] = useState(routeCategory?.categoryName ?? "");
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [isActive, setIsActive] = useState(routeCategory?.status === "active");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isSubmitting = isCreating || isUpdating;

  const handleNameChange = _useInputChange(setName);
  const handleStatusChange = (): void => { setIsActive((currentIsActive) => !currentIsActive); };

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
      let response: CategoryCreateResponse;

      if (isEditMode && id) {
        response = await updateCategory({ id, category_name: name, status: isActive ? 1 : 0 }).unwrap();
      } else {
        response = await createCategory({ category_name: name, status: 1 }).unwrap();
      }

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

  /**
   * Go back.
   * @returns {void} No return value
   */
  const goBack = (): void => { navigate(-1); };

  return {
    name,
    isActive,
    isEditMode,
    isSubmitting,
    errorMessage,
    successMessage,
    handleNameChange,
    handleStatusChange,
    handleSubmit,
    goBack,
  };
};
