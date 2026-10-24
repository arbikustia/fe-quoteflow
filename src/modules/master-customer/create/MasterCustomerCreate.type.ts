import type { ChangeEvent, SyntheticEvent } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

export type CustomerFormValues = {
  name: string;
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
  id: string | undefined;
  isEditMode: boolean;
  isActive: boolean;
  getValues: () => CustomerFormValues;
  validateForm: () => Promise<boolean>;
};

export type CustomerSubmissionState = {
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  handleSubmit: (event: SyntheticEvent) => Promise<void>;
};

export type CustomerFormFields = {
  name: string;
  address: string;
  phoneNumber: string;
  isActive: boolean;
  handleNameChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePhoneNumberChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleAddressChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStatusChange: () => void;
};

export type MasterCustomerCreateFormState = {
  name: string;
  address: string;
  phoneNumber: string;
  isActive: boolean;
  isEditMode: boolean;
  handleStatusChange: () => void;
  isLoadingInitialData: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  errors: FieldErrors<CustomerFormValues>;
  isSubmitted: boolean;
  handleNameChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePhoneNumberChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleAddressChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (event: SyntheticEvent) => void;
  goBack: () => void;
};
