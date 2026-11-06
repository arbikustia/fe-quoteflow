import type * as React from "react";
import type { FieldErrors } from "react-hook-form";

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
