import type { FieldErrors, ResolverResult } from "react-hook-form";

import type { ApiMessages } from "@/types/api.type";

import { ORDER_TYPE_ACTIVE_STATUS, ORDER_TYPE_INACTIVE_STATUS } from "../MasterOrderType.config";
import type { OrderTypeCreatePayload, OrderTypeMutationResponse } from "../MasterOrderType.type";

import { ORDER_TYPE_FORM_DEFAULT_VALUES, ORDER_TYPE_FORM_MESSAGE } from "./MasterOrderTypeCreate.config";
import type {
  OrderTypeDetailQueryState,
  OrderTypeFieldErrors,
  OrderTypeFieldName,
  OrderTypeFormSource,
  OrderTypeFormValues,
  OrderTypeSubmitTarget,
  OrderTypeToggleChangeHandlers,
  OrderTypeToggleField,
  OrderTypeValidValues,
} from "./MasterOrderTypeCreate.type";
import { OrderTypeDetailSchema, OrderTypeFormSchema } from "./MasterOrderTypeCreate.type";

/**
 * Join backend messages into one display string.
 * @param {ApiMessages} [messages] - Backend response messages
 * @returns {string} - Display message
 */
export const formatApiMessages = (messages?: ApiMessages): string => {
  if (Array.isArray(messages)) {
    return messages.join(" ");
  }

  return messages || ORDER_TYPE_FORM_MESSAGE.REQUEST_FAILED;
};

/**
 * Normalize the order type detail query into the form source (single upstream fallback).
 * @param {OrderTypeDetailQueryState} queryState - RTK Query data and flags; data is undefined in create mode
 * @returns {OrderTypeFormSource} - Form status and initial values
 */
export const normalizeOrderTypeFormSource = (queryState: OrderTypeDetailQueryState): OrderTypeFormSource => {
  const { data, isLoading, isError } = queryState;

  if (isLoading) {
    return { formStatus: "loading", initialValues: ORDER_TYPE_FORM_DEFAULT_VALUES };
  }

  if (!data) {
    return { formStatus: isError ? "error" : "ready", initialValues: ORDER_TYPE_FORM_DEFAULT_VALUES };
  }

  const parsedDetail = OrderTypeDetailSchema.safeParse(data.data);

  if (!data.status || !parsedDetail.success) {
    return { formStatus: "error", initialValues: ORDER_TYPE_FORM_DEFAULT_VALUES };
  }

  return { formStatus: "ready", initialValues: parsedDetail.data };
};

/**
 * Validate form values with the order type schema; react-hook-form resolver.
 * @param {OrderTypeFormValues} values - Current form values
 * @returns {ResolverResult<OrderTypeFormValues, OrderTypeValidValues>} - Parsed values, or the first error per field
 */
export const resolveOrderTypeForm = (values: OrderTypeFormValues): ResolverResult<OrderTypeFormValues, OrderTypeValidValues> => {
  const result = OrderTypeFormSchema.safeParse(values);

  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const errors: FieldErrors<OrderTypeFormValues> = {};

  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as OrderTypeFieldName;

    errors[field] = errors[field] ?? { type: issue.code, message: issue.message };
  });

  return { values: {}, errors };
};

/**
 * Pick the message of every field error.
 * @param {FieldErrors<OrderTypeFormValues>} errors - react-hook-form errors
 * @returns {OrderTypeFieldErrors} - Message per field
 */
export const getOrderTypeFieldErrors = (errors: FieldErrors<OrderTypeFormValues>): OrderTypeFieldErrors => {
  const fieldErrors: OrderTypeFieldErrors = {};

  (Object.keys(errors) as OrderTypeFieldName[]).forEach((field) => {
    fieldErrors[field] = errors[field]?.message;
  });

  return fieldErrors;
};

/**
 * Build the create / update request body from validated form values.
 * @param {OrderTypeValidValues} values - Valid form values
 * @returns {OrderTypeCreatePayload} - Request body
 */
export const buildOrderTypePayload = (values: OrderTypeValidValues): OrderTypeCreatePayload => ({
  name: values.name,
  is_handover: values.isHandover,
  status: values.isActive ? ORDER_TYPE_ACTIVE_STATUS : ORDER_TYPE_INACTIVE_STATUS,
});

/**
 * Send the update request when editing, otherwise the create request.
 * @param {OrderTypeValidValues} values - Valid form values
 * @param {OrderTypeSubmitTarget} target - Mutation triggers and order type id
 * @returns {Promise<OrderTypeMutationResponse>} - Mutation response
 */
export const sendOrderTypeMutation = (values: OrderTypeValidValues, target: OrderTypeSubmitTarget): Promise<OrderTypeMutationResponse> => {
  const payload = buildOrderTypePayload(values);

  if (target.id) {
    return target.updateOrderType({ ...payload, id: target.id }).unwrap();
  }

  return target.createOrderType(payload).unwrap();
};

/**
 * Create one change handler per switch field.
 * @param {(field: OrderTypeToggleField, checked: boolean) => void} onToggle - Stores the new switch value
 * @returns {OrderTypeToggleChangeHandlers} - Change handler per switch field
 */
export const createToggleChangeHandlers = (onToggle: (field: OrderTypeToggleField, checked: boolean) => void): OrderTypeToggleChangeHandlers => {
  /**
   * Create the change handler of a switch field.
   * @param {OrderTypeToggleField} field - Switch field
   * @returns {(checked: boolean) => void} - Switch change handler
   */
  const createHandler = (field: OrderTypeToggleField) => (checked: boolean): void => {
    onToggle(field, checked);
  };

  return {
    isHandover: createHandler("isHandover"),
    isActive: createHandler("isActive"),
  };
};
