import type { ChangeEvent, SyntheticEvent } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

export type CustomerFormValues = {
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  isActive: boolean;
};

export type CustomerFormValidation = {
  errors: FieldErrors<CustomerFormValues>;
  isSubmitted: boolean;
  getValues: () => CustomerFormValues;
  register: UseFormRegister<CustomerFormValues>;
  validateForm: () => Promise<boolean>;
};


export type CustomerSubmissionParams = {
  id?: string;
  isEditMode: boolean;
  isActive: boolean;
  getValues: () => CustomerFormValues;
  validateForm: () => Promise<boolean>;
};

export type CustomerSubmissionState = {
  isSubmitting: boolean;
  errorMessage?: string;
  successMessage?: string;
  handleSubmit: (event: SyntheticEvent) => Promise<void>;
};

export type CustomerFormFields = {
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  isActive: boolean;
  handleNameChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleEmailChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePhoneNumberChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleAddressChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStatusChange: () => void;
};

export type CustomerFieldConfig = {
  errorMessage?: string;
  id: string;
  inputMode?: "numeric";
  label: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  pattern?: string;
  placeholder: string;
  required?: boolean;
  title?: string;
  type?: "text" | "email" | "tel";
  value: string;
};

export type MasterCustomerCreateFormState = {
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  isActive: boolean;
  isEditMode: boolean;
  handleStatusChange: () => void;
  isLoadingInitialData: boolean;
  isSubmitting: boolean;
  errorMessage?: string;
  successMessage?: string;
  errors: FieldErrors<CustomerFormValues>;
  isSubmitted: boolean;
  handleNameChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleEmailChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePhoneNumberChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleAddressChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (event: SyntheticEvent) => void;
  goBack: () => void;
};
