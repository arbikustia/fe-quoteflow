import type { ChangeEvent, SyntheticEvent } from "react";
import type { FieldErrors, UseFormSetValue } from "react-hook-form";

import type { useCreateCategoryMutation, useUpdateCategoryMutation } from "@/services/master-category.service";

export type CategoryFormValues = {
  name: string;
  isActive: boolean;
};

export type CategorySubmitParams = {
  id?: string;
  isEditMode: boolean;
  getValues: () => CategoryFormValues;
  createCategory: ReturnType<typeof useCreateCategoryMutation>[0];
  updateCategory: ReturnType<typeof useUpdateCategoryMutation>[0];
};

export type CategoryFormFields = {
  name: string;
  isActive: boolean;
  errors: FieldErrors<CategoryFormValues>;
  getValues: () => CategoryFormValues;
  setValue: UseFormSetValue<CategoryFormValues>;
  trigger: () => Promise<boolean>;
};

export type CategorySubmissionContext = {
  params: CategorySubmitParams;
  trigger: () => Promise<boolean>;
  navigate: (path: string, options: { state: { successMessage: string } }) => void;
  setIsSubmitted: (value: boolean) => void;
  setErrorMessage: (message: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
};

export type CategoryActionsContext = {
  fields: CategoryFormFields;
  id?: string;
  isEditMode: boolean;
  createCategory: ReturnType<typeof useCreateCategoryMutation>[0];
  updateCategory: ReturnType<typeof useUpdateCategoryMutation>[0];
  navigate: (path: string, options: { state: { successMessage: string } }) => void;
  setIsSubmitted: (value: boolean) => void;
  setErrorMessage: (message: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
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
