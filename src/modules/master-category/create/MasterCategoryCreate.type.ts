import type { ChangeEvent, SyntheticEvent } from "react";
import type { FieldErrors } from "react-hook-form";

export type CategoryFormValues = {
  name: string;
  isActive: boolean;
};

export type MasterCategoryCreateFormState = {
  name: string;
  isActive: boolean;
  isEditMode: boolean;
  isLoadingInitialData: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  errors: FieldErrors<CategoryFormValues>;
  isSubmitted: boolean;
  handleNameChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStatusChange: () => void;
  handleSubmit: (event: SyntheticEvent) => void;
  goBack: () => void;
};
