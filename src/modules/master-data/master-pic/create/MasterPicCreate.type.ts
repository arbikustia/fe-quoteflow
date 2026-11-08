import type * as React from "react";
import type { Control, FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

import type { useCreatePicMutation, useUpdatePicMutation } from "@/services/master-pic.service";

export type PicFormValues = {
  name: string;
  isActive: boolean;
};

export type PicFormValidation = {
  errors: FieldErrors<PicFormValues>;
  isSubmitted: boolean;
};

export type PicFormFieldsState = PicFormValues & PicFormValidation & {
  getValues: () => PicFormValues;
  validateForm: () => Promise<boolean>;
  handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: () => void;
};

export type PicSubmissionParams = {
  id?: string;
  isEditMode: boolean;
  isActive: boolean;
  getValues: () => PicFormValues;
  validateForm: () => Promise<boolean>;
};

export type PicFormInstance = {
  control: Control<PicFormValues>;
  formState: {
    errors: FieldErrors<PicFormValues>;
    isSubmitted: boolean;
  };
  getValues: () => PicFormValues;
  register: UseFormRegister<PicFormValues>;
  setValue: UseFormSetValue<PicFormValues>;
  trigger: () => Promise<boolean>;
};

export type PicSubmitContext = {
  params: PicSubmissionParams;
  createPic: ReturnType<typeof useCreatePicMutation>[0];
  updatePic: ReturnType<typeof useUpdatePicMutation>[0];
  navigate: (path: string, options: { state: { successMessage: string } }) => void;
  setErrorMessage: (message: string | null) => void;
};

export type MasterPicCreateState = {
  name: string;
  isActive: boolean;
  isEditMode: boolean;
  isLoadingInitialData: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  errors: FieldErrors<PicFormValues>;
  isSubmitted: boolean;
  handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: () => void;
  handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
  goBack: () => void;
};
