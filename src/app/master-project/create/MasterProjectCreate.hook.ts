import type * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCreateProjectMutation } from "@/services/master-project.service";
import type { MasterProjectCreateFormState } from "@/modules/master-project/MasterProject.type";

/**
 * Format backend messages into a display string.
 * @param {string[] | string | null} messages - Backend response messages
 * @returns {string} Display message
 */
const _formatMessages = (messages: string[] | string | null): string => {
  if (Array.isArray(messages)) {
    return messages.join(" ");
  }

  return messages ?? "Project request failed.";
};

/**
 * Manage master project create form state and submission.
 * @returns {MasterProjectCreateFormState} Form state and handlers
 */
export const useMasterProjectCreate = (): MasterProjectCreateFormState => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [remark, setRemark] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [createProject, { isLoading: isSubmitting }] = useCreateProjectMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => setName(event.target.value);
  const handleRemarkChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => setRemark(event.target.value);
  const toggleStatus = (): void => setIsActive((previous) => !previous);

  /**
   * Submit new project to API.
   * @param {React.SyntheticEvent} event - Form submit event
   * @returns {Promise<void>} Resolves after submission handling
   */
  const handleSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await createProject({ name, remark, status: isActive ? 1 : 0 }).unwrap();

      if (!response.status) {
        setErrorMessage(_formatMessages(response.messages));

        return;
      }

      setSuccessMessage("Project created successfully.");
      navigate("/master-project");
    } catch {
      setErrorMessage("Unable to create project. Please try again.");
    }
  };

  const goBack = (): void => { navigate(-1); };

  return {
    name,
    remark,
    isActive,
    isSubmitting,
    errorMessage,
    successMessage,
    handleNameChange,
    handleRemarkChange,
    toggleStatus,
    handleSubmit,
    goBack,
  };
};
