import type { ChangeEvent, SubmitEvent } from "react";
import { z } from "zod";

import { PHONE_NUMBER_PATTERN } from "@/constants/regex.constant";

import { CUSTOMER_ACTIVE_STATUS } from "../MasterCustomer.config";
import type { CustomerCreatePayload, CustomerMutationResponse, CustomerUpdatePayload } from "../MasterCustomer.type";

import { CUSTOMER_FORM_MESSAGE } from "./MasterCustomerCreate.config";

/** Customer form input, validated on submit. */
export const CustomerFormSchema = z.object({
  name: z.string().trim().min(1, CUSTOMER_FORM_MESSAGE.NAME_REQUIRED),
  email: z
    .string()
    .trim()
    .min(1, CUSTOMER_FORM_MESSAGE.EMAIL_REQUIRED)
    .pipe(z.email(CUSTOMER_FORM_MESSAGE.EMAIL_INVALID)),
  phoneNumber: z
    .string()
    .min(1, CUSTOMER_FORM_MESSAGE.PHONE_REQUIRED)
    .regex(PHONE_NUMBER_PATTERN, CUSTOMER_FORM_MESSAGE.PHONE_INVALID),
  address: z.string().trim().min(1, CUSTOMER_FORM_MESSAGE.ADDRESS_REQUIRED),
  isActive: z.boolean(),
});

export type CustomerFormValues = z.infer<typeof CustomerFormSchema>;

/** Text fields of the customer form. */
export const CustomerTextFieldSchema = z.enum(["name", "email", "phoneNumber", "address"]);

export type CustomerTextField = z.infer<typeof CustomerTextFieldSchema>;

/** Optional API text seeded into a form input. */
const CustomerFormTextSchema = z
  .string()
  .nullish()
  .transform((value): string => value ?? "");

/** Customer from `GET /api/customer/{id}`, normalized into form values. */
export const CustomerDetailSchema = z
  .object({
    name: CustomerFormTextSchema,
    email: CustomerFormTextSchema,
    address: CustomerFormTextSchema,
    phone_number: CustomerFormTextSchema,
    status: z.number().catch(CUSTOMER_ACTIVE_STATUS),
  })
  .transform((customer): CustomerFormValues => ({
    name: customer.name,
    email: customer.email,
    address: customer.address,
    phoneNumber: customer.phone_number,
    isActive: customer.status === CUSTOMER_ACTIVE_STATUS,
  }));

/** Whether the form creates a new customer or edits an existing one. */
export type CustomerFormMode = "create" | "edit";

/** Whether the form can be shown yet. */
export type CustomerFormStatus = "loading" | "error" | "ready";

/** Copy that differs between create and edit mode. */
export type CustomerFormModeText = {
  title: string;
  subtitle: string;
  submitLabel: string;
  submittingLabel: string;
  successMessage: string;
  failureMessage: string;
};

/** Validation message per text field; absent when the field is valid. */
export type CustomerFieldErrors = Partial<Record<CustomerTextField, string>>;

/** Normalized customer detail query used to seed the form. */
export type CustomerFormSource = {
  formStatus: CustomerFormStatus;
  initialValues: CustomerFormValues;
};

/** Raw RTK Query state consumed by the detail normalizer. */
export type CustomerDetailQueryState = {
  data?: CustomerMutationResponse;
  isLoading: boolean;
  isError: boolean;
};

/** Result of an RTK Query mutation trigger. */
export type CustomerMutationResult = {
  unwrap: () => Promise<CustomerMutationResponse>;
};

/** Mutation triggers and target of a customer submit. */
export type CustomerSubmitTarget = {
  id?: string;
  createCustomer: (payload: CustomerCreatePayload) => CustomerMutationResult;
  updateCustomer: (payload: CustomerUpdatePayload) => CustomerMutationResult;
};

/** Inputs of the create / edit form hook. */
export type MasterCustomerCreateParams = CustomerSubmitTarget & {
  mode: CustomerFormMode;
  initialValues: CustomerFormValues;
};

/** Change handlers of the form fields. */
export type CustomerFieldHandlers = {
  handleNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handlePhoneNumberChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleAddressChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  handleStatusChange: (isActive: boolean) => void;
};

/** Submit state and handlers of the form. */
export type CustomerSubmission = {
  errorMessage?: string;
  submitCustomer: (values: CustomerFormValues) => Promise<void>;
  handleBack: () => void;
};

/** Form state and handlers owned by the module hook. */
export type MasterCustomerCreateController = CustomerFieldHandlers & {
  values: CustomerFormValues;
  fieldErrors: CustomerFieldErrors;
  errorMessage?: string;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  handleBack: () => void;
};

/** Form fields rendered with the shared input component. */
export type CustomerInputField = Exclude<CustomerTextField, "address">;

/** Static configuration of one text input. */
export type CustomerInputFieldConfig = {
  id: string;
  label: string;
  placeholder: string;
  type: "text" | "email" | "tel";
  inputMode?: "numeric";
  pattern?: string;
  title?: string;
};

/** Props of the create / edit form view. */
export type MasterCustomerCreateProps = {
  mode: CustomerFormMode;
  formStatus: CustomerFormStatus;
  values: CustomerFormValues;
  fieldErrors: CustomerFieldErrors;
  isSubmitting: boolean;
  errorMessage?: string;
  onNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPhoneNumberChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAddressChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onStatusChange: (isActive: boolean) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  onBack: () => void;
};
