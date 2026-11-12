import type { FieldErrors, ResolverResult } from "react-hook-form";

import type { ApiMessages } from "@/types/api.type";

import { USER_ACTIVE_STATUS, USER_INACTIVE_STATUS } from "../MasterUser.config";
import type { UserCreatePayload, UserMutationResponse } from "../MasterUser.type";

import { USER_FORM_DEFAULT_VALUES, USER_FORM_MESSAGE } from "./MasterUserCreate.config";
import type {
  UserFieldErrors,
  UserFieldName,
  UserFormMode,
  UserFormSource,
  UserFormSourceParams,
  UserFormValues,
  UserRoleOptions,
  UserRoleOptionsParams,
  UserSubmitTarget,
  UserValidValues,
} from "./MasterUserCreate.type";
import { UserCreateFormSchema, UserFormItemSchema, UserFormSchema } from "./MasterUserCreate.type";

/**
 * Join backend messages into one display string.
 * @param {ApiMessages} [messages] - Backend response messages
 * @returns {string} - Display message
 */
export const formatApiMessages = (messages?: ApiMessages): string => {
  if (Array.isArray(messages)) {
    return messages.join(" ");
  }

  return messages || USER_FORM_MESSAGE.REQUEST_FAILED;
};

/**
 * Normalize the user detail query into the form source (single upstream fallback).
 * Create mode skips the query, so no data and no flags yield an empty ready form.
 * @param {UserFormSourceParams} params - Detail query data and flags
 * @returns {UserFormSource} - Form status and initial values
 */
export const normalizeUserFormSource = (params: UserFormSourceParams): UserFormSource => {
  const { data, isLoading, isError } = params;

  if (isLoading) {
    return { formStatus: "loading", initialValues: USER_FORM_DEFAULT_VALUES };
  }

  if (isError) {
    return { formStatus: "error", initialValues: USER_FORM_DEFAULT_VALUES };
  }

  if (!data) {
    return { formStatus: "ready", initialValues: USER_FORM_DEFAULT_VALUES };
  }

  const parsedUser = UserFormItemSchema.safeParse(data.data);

  if (!data.status || !parsedUser.success) {
    return { formStatus: "error", initialValues: USER_FORM_DEFAULT_VALUES };
  }

  return { formStatus: "ready", initialValues: parsedUser.data };
};

/**
 * Validate form values with the schema of the mode (create also requires the password).
 * @param {UserFormValues} values - Current form values
 * @param {UserFormMode} mode - Create or edit mode
 * @returns {ResolverResult<UserFormValues, UserValidValues>} - Parsed values, or the first error per field
 */
export const resolveUserForm = (values: UserFormValues, mode: UserFormMode): ResolverResult<UserFormValues, UserValidValues> => {
  const result = (mode === "create" ? UserCreateFormSchema : UserFormSchema).safeParse(values);

  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const errors: FieldErrors<UserFormValues> = {};

  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as UserFieldName;

    errors[field] = errors[field] ?? { type: issue.code, message: issue.message };
  });

  return { values: {}, errors };
};

/**
 * Pick the message of every field error.
 * @param {FieldErrors<UserFormValues>} errors - react-hook-form errors
 * @returns {UserFieldErrors} - Message per field
 */
export const getUserFieldErrors = (errors: FieldErrors<UserFormValues>): UserFieldErrors => {
  const fieldErrors: UserFieldErrors = {};

  (Object.keys(errors) as UserFieldName[]).forEach((field) => {
    fieldErrors[field] = errors[field]?.message;
  });

  return fieldErrors;
};

/**
 * Build the create request body from validated form values.
 * @param {UserValidValues} values - Valid form values
 * @returns {UserCreatePayload} - Request body
 */
export const buildUserPayload = (values: UserValidValues): UserCreatePayload => ({
  username: values.username,
  email: values.email,
  password: values.password,
  role: [values.role],
  status: values.isActive ? USER_ACTIVE_STATUS : USER_INACTIVE_STATUS,
});

/**
 * Send the update request (without password) when editing, otherwise the create request.
 * @param {UserValidValues} values - Valid form values
 * @param {UserSubmitTarget} target - Mutation triggers and user id
 * @returns {Promise<UserMutationResponse>} - Mutation response
 */
export const sendUserMutation = (values: UserValidValues, target: UserSubmitTarget): Promise<UserMutationResponse> => {
  const { password, ...payload } = buildUserPayload(values);

  if (target.id) {
    return target.updateUser({ ...payload, id: target.id }).unwrap();
  }

  return target.createUser({ ...payload, password }).unwrap();
};

/**
 * Normalize the role select-all query into select options (single upstream fallback).
 * @param {UserRoleOptionsParams} params - Role query data and flags
 * @returns {UserRoleOptions} - Options and load state
 */
export const normalizeRoleOptions = (params: UserRoleOptionsParams): UserRoleOptions => {
  const { data, isLoading, isError } = params;

  if (isError) {
    return { roleOptions: [], isRoleOptionsLoading: false, roleOptionsError: USER_FORM_MESSAGE.ROLES_FAILED };
  }

  if (data && !data.status) {
    return { roleOptions: [], isRoleOptionsLoading: false, roleOptionsError: USER_FORM_MESSAGE.REQUEST_FAILED };
  }

  return {
    roleOptions: (data?.data ?? []).map((option) => ({ label: option.role, value: option.role })),
    isRoleOptionsLoading: isLoading,
  };
};
