import type { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { CategoryCreateResponse } from "@/modules/master-category/MasterCategory.type";
import { useCreateCategoryMutation } from "@/services/master-category.service";

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
 * Helper creating input change handler.
 * @param {Dispatch<SetStateAction<string>>} setter - State setter
 * @returns {(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void} Change handler
 */
const _useInputChange = (setter: Dispatch<SetStateAction<string>>): ((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void) => (
  (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => { setter(event.target.value); }
);

/**
 * Hook managing submission logic.
 * @param {string} name - Name input
 * @returns {{ readonly isSubmitting: boolean; readonly errorMessage: string | null; readonly successMessage: string | null; readonly handleSubmit: (event: SyntheticEvent) => Promise<void>; }} Submission state
 */
const useCategorySubmission = (
  name: string,
): {
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly successMessage: string | null;
  readonly handleSubmit: (event: SyntheticEvent) => Promise<void>;
} => {
  const navigate = useNavigate();
  const [createCategory, { isLoading: isSubmitting }] = useCreateCategoryMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Submit category form.
   * @param {SyntheticEvent} event - Form submit event
   * @returns {Promise<void>} Submission result
   */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response: CategoryCreateResponse = await createCategory({ category_name: name }).unwrap();

      if (!response.status) {
        setErrorMessage(_formatMessages(response.messages));

        return;
      }

      setSuccessMessage("Category created successfully.");
      navigate("/master-category");
    } catch {
      setErrorMessage("Unable to create category. Please try again.");
    }
  };

  return { isSubmitting, errorMessage, successMessage, handleSubmit };
};

/**
 * Hook managing master category create form state and submission.
 * @returns {MasterCategoryCreateFormState} Form state and handlers
 */
export const useMasterCategoryCreate = (): MasterCategoryCreateFormState => {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleNameChange = _useInputChange(setName);
  const submission = useCategorySubmission(name);

  const goBack = (): void => { navigate(-1); };

  return {
    name,
    handleNameChange,
    goBack,
    ...submission,
  };
};
