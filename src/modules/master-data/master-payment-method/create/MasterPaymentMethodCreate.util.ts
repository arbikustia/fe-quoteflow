import type { FieldErrors, ResolverResult } from "react-hook-form";

import type { ApiMessages } from "@/types/api.type";

import { PAYMENT_METHOD_ACTIVE_STATUS, PAYMENT_METHOD_INACTIVE_STATUS } from "../MasterPaymentMethod.config";
import type { PaymentMethodCreatePayload, PaymentMethodMutationResponse } from "../MasterPaymentMethod.type";

import { PAYMENT_METHOD_FORM_DEFAULT_VALUES, PAYMENT_METHOD_FORM_MESSAGE } from "./MasterPaymentMethodCreate.config";
import type {
  PaymentMethodFieldErrors,
  PaymentMethodFieldName,
  PaymentMethodFormSource,
  PaymentMethodFormSourceParams,
  PaymentMethodFormValues,
  PaymentMethodSubmitTarget,
  PaymentMethodValidValues,
} from "./MasterPaymentMethodCreate.type";
import { PaymentMethodFormSchema, PaymentMethodRouteItemSchema } from "./MasterPaymentMethodCreate.type";

/**
 * Join backend messages into one display string.
 * @param {ApiMessages} [messages] - Backend response messages
 * @returns {string} - Display message
 */
export const formatApiMessages = (messages?: ApiMessages): string => {
  if (Array.isArray(messages)) {
    return messages.join(" ");
  }

  return messages || PAYMENT_METHOD_FORM_MESSAGE.REQUEST_FAILED;
};

/**
 * Normalize the router-state payment method into the form source (single upstream fallback).
 * @param {PaymentMethodFormSourceParams} params - Route id and the payment method passed from the list
 * @returns {PaymentMethodFormSource} - Form status and initial values
 */
export const normalizePaymentMethodFormSource = (params: PaymentMethodFormSourceParams): PaymentMethodFormSource => {
  const { id, routePaymentMethod } = params;

  if (!id) {
    return { formStatus: "ready", initialValues: PAYMENT_METHOD_FORM_DEFAULT_VALUES };
  }

  const parsedPaymentMethod = PaymentMethodRouteItemSchema.safeParse(routePaymentMethod);

  if (!parsedPaymentMethod.success || routePaymentMethod?.id !== id) {
    return { formStatus: "error", initialValues: PAYMENT_METHOD_FORM_DEFAULT_VALUES };
  }

  return { formStatus: "ready", initialValues: parsedPaymentMethod.data };
};

/**
 * Validate form values with the payment method schema; react-hook-form resolver.
 * @param {PaymentMethodFormValues} values - Current form values
 * @returns {ResolverResult<PaymentMethodFormValues, PaymentMethodValidValues>} - Parsed values, or the first error per field
 */
export const resolvePaymentMethodForm = (values: PaymentMethodFormValues): ResolverResult<PaymentMethodFormValues, PaymentMethodValidValues> => {
  const result = PaymentMethodFormSchema.safeParse(values);

  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const errors: FieldErrors<PaymentMethodFormValues> = {};

  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as PaymentMethodFieldName;

    errors[field] = errors[field] ?? { type: issue.code, message: issue.message };
  });

  return { values: {}, errors };
};

/**
 * Pick the message of every field error.
 * @param {FieldErrors<PaymentMethodFormValues>} errors - react-hook-form errors
 * @returns {PaymentMethodFieldErrors} - Message per field
 */
export const getPaymentMethodFieldErrors = (errors: FieldErrors<PaymentMethodFormValues>): PaymentMethodFieldErrors => {
  const fieldErrors: PaymentMethodFieldErrors = {};

  (Object.keys(errors) as PaymentMethodFieldName[]).forEach((field) => {
    fieldErrors[field] = errors[field]?.message;
  });

  return fieldErrors;
};

/**
 * Build the create / update request body from validated form values.
 * @param {PaymentMethodValidValues} values - Valid form values
 * @returns {PaymentMethodCreatePayload} - Request body
 */
export const buildPaymentMethodPayload = (values: PaymentMethodValidValues): PaymentMethodCreatePayload => ({
  name: values.name,
  description: values.description,
  status: values.isActive ? PAYMENT_METHOD_ACTIVE_STATUS : PAYMENT_METHOD_INACTIVE_STATUS,
});

/**
 * Send the update request when editing, otherwise the create request.
 * @param {PaymentMethodValidValues} values - Valid form values
 * @param {PaymentMethodSubmitTarget} target - Mutation triggers and payment method id
 * @returns {Promise<PaymentMethodMutationResponse>} - Mutation response
 */
export const sendPaymentMethodMutation = (values: PaymentMethodValidValues, target: PaymentMethodSubmitTarget): Promise<PaymentMethodMutationResponse> => {
  const payload = buildPaymentMethodPayload(values);

  if (target.id) {
    return target.updatePaymentMethod({ ...payload, id: target.id }).unwrap();
  }

  return target.createPaymentMethod(payload).unwrap();
};
