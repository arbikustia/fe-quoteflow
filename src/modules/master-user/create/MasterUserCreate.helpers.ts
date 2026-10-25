import type {
  UserCreateResponse,
  UserData,
  UserDetailResponse,
} from "../MasterUser.type";

import type { UserSubmissionParams } from "./MasterUserCreate.type";

import {
  mapUser,
  useCreateUserMutation,
  useUpdateUserMutation,
} from "@/services/master-user.service";

/**
 * Resolve detail response into single UI user.
 * @param {UserDetailResponse | undefined} response - Detail response
 * @returns {UserData | null} User or null
 */
export const resolveUserDetail = (
  response: UserDetailResponse | undefined,
): UserData | null => {
  if (!response?.status || !response.data) {
    return null;
  }

  const rawItem = Array.isArray(response.data)
    ? response.data[0]
    : response.data;

  return rawItem ? mapUser(rawItem) : null;
};

/**
 * Resolve role request error message.
 * @param {boolean} hasRoleError - Whether request failed
 * @param {boolean | undefined} responseStatus - API response status
 * @returns {string | null} Error message
 */
export const getRoleOptionsError = (
  hasRoleError: boolean,
  responseStatus: boolean | undefined,
): string | null => {
  if (hasRoleError) {
    return "Unable to load roles.";
  }

  if (responseStatus === false) {
    return "Role request failed.";
  }

  return null;
};

/**
 * Send create or update user mutation.
 * @param {UserSubmissionParams} params - Submission parameters
 * @param {ReturnType<typeof useCreateUserMutation>[0]} createUser - Create trigger
 * @param {ReturnType<typeof useUpdateUserMutation>[0]} updateUser - Update trigger
 * @returns {Promise<UserCreateResponse>} Mutation response
 */
export const sendUserMutation = (
  params: UserSubmissionParams,
  createUser: ReturnType<typeof useCreateUserMutation>[0],
  updateUser: ReturnType<typeof useUpdateUserMutation>[0],
): Promise<UserCreateResponse> => {
  const { id, isEditMode, isActive } = params;
  const values = params.getValues();

  if (isEditMode && id) {
    return updateUser({
      id,
      username: values.username,
      email: values.email,
      role: [values.role],
      status: isActive ? 1 : 0,
    }).unwrap();
  }

  return createUser({
    username: values.username,
    email: values.email,
    password: values.password,
    role: [values.role],
    status: 1,
  }).unwrap();
};

/**
 * Resolve submission error message depending on mode.
 * @param {boolean} isEditMode - Edit mode flag
 * @returns {string} Error message
 */
export const resolveUserSubmissionError = (isEditMode: boolean): string => (
  isEditMode
    ? "Unable to update user. Please try again."
    : "Unable to create user. Please try again."
);
