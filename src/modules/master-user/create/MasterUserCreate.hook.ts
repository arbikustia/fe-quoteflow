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
        ? await updateUser({ id, username, email, password: password || undefined, role: [role], status: isActive ? 1 : 0 }).unwrap()
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
 * Hook managing form fields and synchronization.
 * @param {UserData | undefined} routeUser - Route user
 * @param {UserData | null} apiItem - API fetched user
 * @returns {UserFormFieldsState} Form fields state
 */
// Form fields remain grouped because they share detail synchronization.
// eslint-disable-next-line max-lines-per-function
const useUserFormFields = (
  routeUser: UserData | undefined,
  apiItem: UserData | null,
): UserFormFieldsState => {
  const initialUsername = routeUser?.username ?? apiItem?.username ?? "";
  const initialEmail = routeUser?.email ?? apiItem?.email ?? "";
  const initialRole = routeUser?.role ?? apiItem?.role ?? "User";

  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [role, setRole] = useState(initialRole);
  const [isActive, setIsActive] = useState(true);
  const [initializedId, setInitializedId] = useState<string | null>(routeUser?.id ?? null);

  if (apiItem && apiItem.id !== initializedId) {
    setInitializedId(apiItem.id);
    setUsername(apiItem.username ?? "");
    setEmail(apiItem.email ?? "");
    setRole(apiItem.role ?? "User");
  }

  /** Update username field. @param {ChangeEvent<HTMLInputElement>} event - Input event */
  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>): void => { setUsername(event.target.value); };
  /** Update email field. @param {ChangeEvent<HTMLInputElement>} event - Input event */
  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => { setEmail(event.target.value); };
  /** Update password field. @param {ChangeEvent<HTMLInputElement>} event - Input event */
  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>): void => { setPassword(event.target.value); };
  /** Toggle password visibility. */
  const handleTogglePasswordVisibility = (): void => { setIsPasswordVisible((prev) => !prev); };
  /** Update role field. @param {ChangeEvent<HTMLSelectElement>} event - Select event */
  const handleRoleChange = (event: ChangeEvent<HTMLSelectElement>): void => { setRole(event.target.value); };
  /** Toggle active state. */
  const handleStatusChange = (): void => { setIsActive((prev) => !prev); };

  return {
    username,
    email,
    password,
    isPasswordVisible,
    role,
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
 * Manage master user create/edit form.
 * @returns {MasterUserCreateFormState} Form state
 */
export const useMasterUserCreateForm = (): MasterUserCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ readonly id?: string }>();
  const isEditMode = Boolean(id);
  const routeUser: UserData | undefined = location.state?.user;

  const { data: detailData } = useGetUserByIdQuery(id ?? "", {
    skip: !isEditMode || !id || Boolean(routeUser),
  });

  const apiItem = _resolveUserDetail(detailData);
  const formFields = useUserFormFields(routeUser, apiItem);
  const submission = useUserSubmission({ id, isEditMode, ...formFields });

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
