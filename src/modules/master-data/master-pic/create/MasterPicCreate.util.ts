import type { FieldErrors, ResolverResult } from "react-hook-form";

import type { ApiMessages } from "@/types/api.type";

import { PIC_ACTIVE_STATUS, PIC_INACTIVE_STATUS } from "../MasterPic.config";
import type { PicCreatePayload, PicMutationResponse } from "../MasterPic.type";

import { PIC_FORM_DEFAULT_VALUES, PIC_FORM_MESSAGE } from "./MasterPicCreate.config";
import type {
  PicFieldErrors,
  PicFieldName,
  PicFormSource,
  PicFormSourceParams,
  PicFormValues,
  PicSubmitTarget,
  PicValidValues,
} from "./MasterPicCreate.type";
import { PicFormSchema, PicRouteItemSchema } from "./MasterPicCreate.type";

/**
 * Join backend messages into one display string.
 * @param {ApiMessages} [messages] - Backend response messages
 * @returns {string} - Display message
 */
export const formatApiMessages = (messages?: ApiMessages): string => {
  if (Array.isArray(messages)) {
    return messages.join(" ");
  }

  return messages || PIC_FORM_MESSAGE.REQUEST_FAILED;
};

/**
 * Normalize the router-state PIC into the form source (single upstream fallback).
 * @param {PicFormSourceParams} params - Route id and the PIC passed from the list
 * @returns {PicFormSource} - Form status and initial values
 */
export const normalizePicFormSource = (params: PicFormSourceParams): PicFormSource => {
  const { id, routePic } = params;

  if (!id) {
    return { formStatus: "ready", initialValues: PIC_FORM_DEFAULT_VALUES };
  }

  const parsedPic = PicRouteItemSchema.safeParse(routePic);

  if (!parsedPic.success || routePic?.id !== id) {
    return { formStatus: "error", initialValues: PIC_FORM_DEFAULT_VALUES };
  }

  return { formStatus: "ready", initialValues: parsedPic.data };
};

/**
 * Validate form values with the PIC schema; react-hook-form resolver.
 * @param {PicFormValues} values - Current form values
 * @returns {ResolverResult<PicFormValues, PicValidValues>} - Parsed values, or the first error per field
 */
export const resolvePicForm = (values: PicFormValues): ResolverResult<PicFormValues, PicValidValues> => {
  const result = PicFormSchema.safeParse(values);

  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const errors: FieldErrors<PicFormValues> = {};

  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as PicFieldName;

    errors[field] = errors[field] ?? { type: issue.code, message: issue.message };
  });

  return { values: {}, errors };
};

/**
 * Pick the message of every field error.
 * @param {FieldErrors<PicFormValues>} errors - react-hook-form errors
 * @returns {PicFieldErrors} - Message per field
 */
export const getPicFieldErrors = (errors: FieldErrors<PicFormValues>): PicFieldErrors => {
  const fieldErrors: PicFieldErrors = {};

  (Object.keys(errors) as PicFieldName[]).forEach((field) => {
    fieldErrors[field] = errors[field]?.message;
  });

  return fieldErrors;
};

/**
 * Build the create / update request body from validated form values.
 * @param {PicValidValues} values - Valid form values
 * @returns {PicCreatePayload} - Request body
 */
export const buildPicPayload = (values: PicValidValues): PicCreatePayload => ({
  name: values.name,
  status: values.isActive ? PIC_ACTIVE_STATUS : PIC_INACTIVE_STATUS,
});

/**
 * Send the update request when editing, otherwise the create request.
 * @param {PicValidValues} values - Valid form values
 * @param {PicSubmitTarget} target - Mutation triggers and PIC id
 * @returns {Promise<PicMutationResponse>} - Mutation response
 */
export const sendPicMutation = (values: PicValidValues, target: PicSubmitTarget): Promise<PicMutationResponse> => {
  const payload = buildPicPayload(values);

  if (target.id) {
    return target.updatePic({ ...payload, id: target.id }).unwrap();
  }

  return target.createPic(payload).unwrap();
};
