import type { ChangeEvent, SyntheticEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { UserData, UserDetailResponse } from "../MasterUser.type";

import type {
  MasterUserCreateFormState,
  UserFormFieldsState,
  UserSubmissionParams,
  UserSubmissionState,
} from "./MasterUserCreate.type";

import {
  mapUser,
  useCreateUserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/services/master-user.service";
import { useGetAllRolesQuery } from "@/services/master-role.service";

/**
 * Resolve detail response into single UI user.
 * @param {UserDetailResponse | undefined} response - Detail response
 * @returns {UserData | null} User or null
 */
const _resolveUserDetail = (response: UserDetailResponse | undefined): UserData | null => {
  if (!response?.status || !response.data) {
    return null;
  }

  const rawItem = Array.isArray(response.data) ? response.data[0] : response.data;

  return rawItem ? mapUser(rawItem) : null;
};

/**
 * Handle form submission logic for create or update.
 * @param {UserSubmissionParams} params - Submission parameters
 * @returns {UserSubmissionState} Submission state
 */
const useUserSubmission = (
  params: UserSubmissionParams,
): UserSubmissionState => {
  const { id, isEditMode, username, email, password, role, isActive } = params;
  const navigate = useNavigate();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSubmitting = isCreating || isUpdating;

  /**
   * Submit user form.
   * @param {SyntheticEvent} event - Submit event
   * @returns {Promise<void>} Async result
   */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const response = isEditMode && id
        ? await updateUser({ id, username, email, role: [role], status: isActive ? 1 : 0 }).unwrap()
        : await createUser({ username, email, password, role: [role], status: 1 }).unwrap();

      if (!response.status) {
        setErrorMessage("User request failed.");

        return;
      }

      navigate("/master-user");
    } catch {
      setErrorMessage(isEditMode ? "Unable to update user. Please try again." : "Unable to create user. Please try again.");
    }
  };

  return { isSubmitting, errorMessage, handleSubmit };
};

/**
 * Sync api user details to state.
 * @param {UserData | null} apiItem - Fetched user
 * @param {string | null} initializedId - Currently initialized ID
 * @param {object} setters - State setter callbacks
 * @param {(id: string | null) => void} setters.setInitializedId - Set initialized ID
 * @param {(val: string) => void} setters.setUsername - Set username
 * @param {(val: string) => void} setters.setEmail - Set email
 * @param {(val: string) => void} setters.setRole - Set role
 */
const _syncUserApiData = (
  apiItem: UserData | null,
  initializedId: string | null,
  setters: {
    setInitializedId: (id: string | null) => void;
    setUsername: (val: string) => void;
    setEmail: (val: string) => void;
    setRole: (val: string) => void;
  },
): void => {
  if (apiItem && apiItem.id !== initializedId) {
    setters.setInitializedId(apiItem.id);
    setters.setUsername(apiItem.username ?? "");
    setters.setEmail(apiItem.email ?? "");
    setters.setRole(apiItem.role ?? "User");
  }
};

/**
 * Hook managing form fields and synchronization.
 * @param {UserData | undefined} routeUser - Route user
 * @param {UserData | null} apiItem - API fetched user
 * @param {UserFormFieldsState["roleOptions"]} roleOptions - Available roles
 * @param {boolean} roleOptionsLoading - Role request loading state
 * @param {string | null} roleOptionsError - Role request error
 * @returns {UserFormFieldsState} Form fields state
 */
// Form fields share detail synchronization and role-option state.
// eslint-disable-next-line max-lines-per-function, max-params
const useUserFormFields = (
  routeUser: UserData | undefined,
  apiItem: UserData | null,
  roleOptions: UserFormFieldsState["roleOptions"],
  roleOptionsLoading: boolean,
  roleOptionsError: string | null,
): UserFormFieldsState => {
  const [username, setUsername] = useState(routeUser?.username ?? apiItem?.username ?? "");
  const [email, setEmail] = useState(routeUser?.email ?? apiItem?.email ?? "");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [role, setRole] = useState(routeUser?.role ?? apiItem?.role ?? "User");
  const [isActive, setIsActive] = useState((routeUser?.status ?? apiItem?.status) !== "inactive");
  const [initializedId, setInitializedId] = useState<string | null>(routeUser?.id ?? null);

  _syncUserApiData(apiItem, initializedId, { setInitializedId, setUsername, setEmail, setRole });

  /**
   * Update username field.
   * @param {ChangeEvent<HTMLInputElement>} event - Input event
   */
  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>): void => { setUsername(event.target.value); };
  /**
   * Update email field.
   * @param {ChangeEvent<HTMLInputElement>} event - Input event
   */
  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => { setEmail(event.target.value); };
  /**
   * Update password field.
   * @param {ChangeEvent<HTMLInputElement>} event - Input event
   */
  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => { setPassword(event.target.value); };
  /** Toggle password visibility. */
  const handleTogglePasswordVisibility = (): void => { setIsPasswordVisible((prev) => !prev); };
  /**
   * Update role field.
   * @param {ChangeEvent<HTMLSelectElement>} event - Select event
   */
  const handleRoleChange = (event: ChangeEvent<HTMLSelectElement>): void => { setRole(event.target.value); };
  /** Toggle active state. */
  const handleStatusChange = (): void => { setIsActive((prev) => !prev); };

  return {
    username,
    email,
    password,
    isPasswordVisible,
    role,
    roleOptions,
    roleOptionsLoading,
    roleOptionsError,
    isActive,
    handleUsernameChange,
    handleEmailChange,
    handlePasswordChange,
    handleTogglePasswordVisibility,
    handleRoleChange,
    handleStatusChange,
  };
};

/**
 * Resolve role request error.
 * @param {boolean} hasRoleError - Whether request failed
 * @param {boolean | undefined} responseStatus - API response status
 * @returns {string | null} Error message
 */
const _getRoleOptionsError = (
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
 * Manage master user create/edit form.
 * @returns {MasterUserCreateFormState} Form state
 */
// Form coordinates detail, role options, submission, and navigation.
// eslint-disable-next-line max-lines-per-function
export const useMasterUserCreateForm = (): MasterUserCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const routeUser: UserData | undefined = location.state?.user;

  const { data: detailData } = useGetUserByIdQuery(id ?? "", {
    skip: !isEditMode || !id || Boolean(routeUser),
  });

  const { data: roleResponse, error: roleError, isLoading: isRoleOptionsLoading } = useGetAllRolesQuery();
  const roleOptions = roleResponse?.status ? roleResponse.data : [];
  const roleOptionsError = _getRoleOptionsError(Boolean(roleError), roleResponse?.status);
  const apiItem = _resolveUserDetail(detailData);
  const formFields = useUserFormFields(
    routeUser,
    apiItem,
    roleOptions,
    isRoleOptionsLoading,
    roleOptionsError,
  );
  const submission = useUserSubmission({
    id,
    isEditMode,
    username: formFields.username,
    email: formFields.email,
    password: formFields.password,
    role: formFields.role,
    isActive: formFields.isActive,
  });

  /**
   *
   */
  const goBack = (): void => {
    navigate(-1);
  };

  return {
    isEditMode,
    goBack,
    ...formFields,
    ...submission,
  };
};
