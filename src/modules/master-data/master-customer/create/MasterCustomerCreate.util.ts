import type { FieldErrors, ResolverResult } from "react-hook-form";

import { NON_DIGIT_PATTERN } from "@/constants/regex.constant";
import type { ApiMessages } from "@/types/api.type";

import { CUSTOMER_ACTIVE_STATUS, CUSTOMER_INACTIVE_STATUS } from "../MasterCustomer.config";
import type { CustomerCreatePayload, CustomerMutationResponse } from "../MasterCustomer.type";

import { CUSTOMER_FORM_DEFAULT_VALUES, CUSTOMER_FORM_MESSAGE } from "./MasterCustomerCreate.config";
import type { CustomerDetailQueryState, CustomerFieldErrors, CustomerFormSource, CustomerFormValues, CustomerSubmitTarget } from "./MasterCustomerCreate.type";
import { CustomerDetailSchema, CustomerFormSchema, CustomerTextFieldSchema } from "./MasterCustomerCreate.type";

/**
 * Keep only the digits of a phone input.
 * @param {string} value - Raw input value
 * @returns {string} - Digits only
 */
export const parsePhoneInput = (value: string): string => value.replace(NON_DIGIT_PATTERN, "");

/**
 * Join backend messages into one display string.
 * @param {ApiMessages} [messages] - Backend response messages
 * @returns {string} - Display message
 */
export const formatApiMessages = (messages?: ApiMessages): string => {
  if (Array.isArray(messages)) {
    return messages.join(" ");
  }

  return messages || CUSTOMER_FORM_MESSAGE.REQUEST_FAILED;
};

/**
 * Normalize the customer detail query into the form source (single upstream fallback).
 * @param {CustomerDetailQueryState} queryState - RTK Query data and flags; data is undefined in create mode
 * @returns {CustomerFormSource} - Form status and initial values
 */
export const normalizeCustomerFormSource = (queryState: CustomerDetailQueryState): CustomerFormSource => {
  const { data, isLoading, isError } = queryState;

  if (isLoading) {
    return { formStatus: "loading", initialValues: CUSTOMER_FORM_DEFAULT_VALUES };
  }

  if (!data) {
    return { formStatus: isError ? "error" : "ready", initialValues: CUSTOMER_FORM_DEFAULT_VALUES };
  }

  const parsedDetail = CustomerDetailSchema.safeParse(data.data);

  if (!data.status || !parsedDetail.success) {
    return { formStatus: "error", initialValues: CUSTOMER_FORM_DEFAULT_VALUES };
  }

  return { formStatus: "ready", initialValues: parsedDetail.data };
};

/**
 * Validate customer form values for react-hook-form with the Zod schema.
 * @param {CustomerFormValues} values - Current form values
 * @returns {ResolverResult<CustomerFormValues>} - Parsed values, or field errors
 */
export const resolveCustomerForm = (values: CustomerFormValues): ResolverResult<CustomerFormValues> => {
  const result = CustomerFormSchema.safeParse(values);

  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const errors: FieldErrors<CustomerFormValues> = {};

  result.error.issues.forEach((issue) => {
    const field = CustomerTextFieldSchema.safeParse(issue.path[0]);

    if (field.success && !errors[field.data]) {
      errors[field.data] = { type: issue.code, message: issue.message };
    }
  });

  return { values: {}, errors };
};

/**
 * Read the first validation message of each text field.
 * @param {FieldErrors<CustomerFormValues>} errors - react-hook-form errors
 * @returns {CustomerFieldErrors} - Message per invalid field
 */
export const getCustomerFieldErrors = (errors: FieldErrors<CustomerFormValues>): CustomerFieldErrors => ({
  name: errors.name?.message,
  email: errors.email?.message,
  phoneNumber: errors.phoneNumber?.message,
  address: errors.address?.message,
});

/**
 * Build the create / update request body from form values.
 * @param {CustomerFormValues} values - Valid form values
 * @returns {CustomerCreatePayload} - Request body
 */
export const buildCustomerPayload = (values: CustomerFormValues): CustomerCreatePayload => ({
  name: values.name,
  email: values.email,
  address: values.address,
  phone_number: values.phoneNumber,
  status: values.isActive ? CUSTOMER_ACTIVE_STATUS : CUSTOMER_INACTIVE_STATUS,
});

/**
 * Send the update request when editing, otherwise the create request.
 * @param {CustomerFormValues} values - Valid form values
 * @param {CustomerSubmitTarget} target - Mutation triggers and customer id
 * @returns {Promise<CustomerMutationResponse>} - Mutation response
 */
export const sendCustomerMutation = (values: CustomerFormValues, target: CustomerSubmitTarget): Promise<CustomerMutationResponse> => {
  const payload = buildCustomerPayload(values);

  if (target.id) {
    return target.updateCustomer({ ...payload, id: target.id }).unwrap();
  }

  return target.createCustomer(payload).unwrap();
};
