import type { ChangeEvent, SyntheticEvent } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

export type OrderTypeFormValues = {
  name: string;
  isHandover: boolean;
  isActive: boolean;
};

export type OrderTypeFormValidation = {
  errors: FieldErrors<OrderTypeFormValues>;
  isSubmitted: boolean;
  getValues: () => OrderTypeFormValues;
  register: UseFormRegister<OrderTypeFormValues>;
  validateForm: () => Promise<boolean>;
};

export type OrderTypeSubmissionParams = {
  id: string | undefined;
  isEditMode: boolean;
  isActive: boolean;
  isHandover: boolean;
  getValues: () => OrderTypeFormValues;
  validateForm: () => Promise<boolean>;
};

export type OrderTypeSubmissionState = {
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  handleSubmit: (event: SyntheticEvent) => Promise<void>;
};

export type OrderTypeFormFields = {
  name: string;
  isHandover: boolean;
  isActive: boolean;
  handleNameChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleHandoverChange: () => void;
  handleStatusChange: () => void;
};

export type MasterOrderTypeCreateFormState = {
  name: string;
  isHandover: boolean;
  isActive: boolean;
  isEditMode: boolean;
  handleHandoverChange: () => void;
  handleStatusChange: () => void;
  isLoadingInitialData: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  errors: FieldErrors<OrderTypeFormValues>;
  isSubmitted: boolean;
  handleNameChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (event: SyntheticEvent) => void;
  goBack: () => void;
};
