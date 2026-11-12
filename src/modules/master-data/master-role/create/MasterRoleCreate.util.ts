import type { FieldErrors, ResolverResult } from "react-hook-form";

import type { ApiMessages } from "@/types/api.type";

import { ROLE_ACTIVE_STATUS, ROLE_INACTIVE_STATUS } from "../MasterRole.config";
import type { RoleCreatePayload, RoleMutationResponse } from "../MasterRole.type";

import { ROLE_FORM_DEFAULT_VALUES, ROLE_FORM_MESSAGE } from "./MasterRoleCreate.config";
import type {
  RoleFieldErrors,
  RoleFieldName,
  RoleFormSource,
  RoleFormSourceParams,
  RoleFormValues,
  RoleSubmitTarget,
  RoleValidValues,
} from "./MasterRoleCreate.type";
import { RoleFormItemSchema,RoleFormSchema } from "./MasterRoleCreate.type";

/**
 * Join backend messages into one display string.
 * @param {ApiMessages} [messages] - Backend response messages
 * @returns {string} - Display message
 */
export const formatApiMessages = (messages?: ApiMessages): string => {
  if (Array.isArray(messages)) {
    return messages.join(" ");
  }

  return messages || ROLE_FORM_MESSAGE.REQUEST_FAILED;
};

/**
 * Normalize the role detail query into the form source (single upstream fallback).
 * Create mode skips the query, so no data and no flags yield an empty ready form.
 * @param {RoleFormSourceParams} params - Detail query data and flags
 * @returns {RoleFormSource} - Form status and initial values
 */
export const normalizeRoleFormSource = (params: RoleFormSourceParams): RoleFormSource => {
  const { data, isLoading, isError } = params;

  if (isLoading) {
    return { formStatus: "loading", initialValues: ROLE_FORM_DEFAULT_VALUES };
  }

  if (isError) {
    return { formStatus: "error", initialValues: ROLE_FORM_DEFAULT_VALUES };
  }

  if (!data) {
    return { formStatus: "ready", initialValues: ROLE_FORM_DEFAULT_VALUES };
  }

  const parsedRole = RoleFormItemSchema.safeParse(data.data);

  if (!data.status || !parsedRole.success) {
    return { formStatus: "error", initialValues: ROLE_FORM_DEFAULT_VALUES };
  }

  return { formStatus: "ready", initialValues: parsedRole.data };
};

/**
 * Validate form values with the role schema; react-hook-form resolver.
 * @param {RoleFormValues} values - Current form values
 * @returns {ResolverResult<RoleFormValues, RoleValidValues>} - Parsed values, or the first error per field
 */
export const resolveRoleForm = (values: RoleFormValues): ResolverResult<RoleFormValues, RoleValidValues> => {
  const result = RoleFormSchema.safeParse(values);

  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const errors: FieldErrors<RoleFormValues> = {};

  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as RoleFieldName;

    errors[field] = errors[field] ?? { type: issue.code, message: issue.message };
  });

  return { values: {}, errors };
};

/**
 * Pick the message of every field error.
 * @param {FieldErrors<RoleFormValues>} errors - react-hook-form errors
 * @returns {RoleFieldErrors} - Message per field
 */
export const getRoleFieldErrors = (errors: FieldErrors<RoleFormValues>): RoleFieldErrors => {
  const fieldErrors: RoleFieldErrors = {};

  (Object.keys(errors) as RoleFieldName[]).forEach((field) => {
    fieldErrors[field] = errors[field]?.message;
  });

  return fieldErrors;
};

/**
 * Build the create / update request body from validated form values.
 * @param {RoleValidValues} values - Valid form values
 * @returns {RoleCreatePayload} - Request body
 */
export const buildRolePayload = (values: RoleValidValues): RoleCreatePayload => ({
  role: values.name,
  status: values.isActive ? ROLE_ACTIVE_STATUS : ROLE_INACTIVE_STATUS,
});

/**
 * Send the update request when editing, otherwise the create request.
 * @param {RoleValidValues} values - Valid form values
 * @param {RoleSubmitTarget} target - Mutation triggers and role id
 * @returns {Promise<RoleMutationResponse>} - Mutation response
 */
export const sendRoleMutation = (values: RoleValidValues, target: RoleSubmitTarget): Promise<RoleMutationResponse> => {
  const payload = buildRolePayload(values);

  if (target.id) {
    return target.updateRole({ ...payload, id: target.id }).unwrap();
  }

  return target.createRole(payload).unwrap();
};
