import type { ChangeEvent, SyntheticEvent } from "react";
import type { Control, FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

import type { useCreateOrderTypeMutation, useUpdateOrderTypeMutation } from "@/services/master-order-type.service";

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

export type OrderTypeFormApi = {
  control: Control<OrderTypeFormValues>;
  errors: FieldErrors<OrderTypeFormValues>;
  getValues: () => OrderTypeFormValues;
  register: UseFormRegister<OrderTypeFormValues>;
  setValue: UseFormSetValue<OrderTypeFormValues>;
  trigger: () => Promise<boolean>;
};

export type OrderTypeFormFields = {
  name: string;
  isHandover: boolean;
  isActive: boolean;
  handleNameChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleHandoverChange: () => void;
  handleStatusChange: () => void;
};

export type OrderTypeSubmitContext = {
  id?: string;
  isEditMode: boolean;
  isActive: boolean;
  isHandover: boolean;
  values: OrderTypeFormValues;
  validateForm: () => Promise<boolean>;
  createOrderType: ReturnType<typeof useCreateOrderTypeMutation>[0];
  updateOrderType: ReturnType<typeof useUpdateOrderTypeMutation>[0];
  navigate: (path: string, options: { state: { successMessage: string } }) => void;
  setErrorMessage: (message: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
};

export type OrderTypeFieldHandlers = Pick<
  OrderTypeFormFields,
  "handleNameChange" | "handleHandoverChange" | "handleStatusChange"
>;

export type OrderTypeCreateFormInput = {
  formFields: OrderTypeFormFields & OrderTypeFormValidation;
  submission: OrderTypeSubmissionState;
  isEditMode: boolean;
  isLoadingDetail: boolean;
  goBack: () => void;
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
