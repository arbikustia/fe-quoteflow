import type {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  SyntheticEvent,
} from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { UserData } from "../MasterUser.type";

import {
  getRoleOptionsError,
  resolveUserDetail,
  resolveUserSubmissionError,
  sendUserMutation,
} from "./MasterUserCreate.helpers";
import type {
  MasterUserCreateFormState,
  UserFieldInputsState,
  UserFormFieldsState,
  UserSubmissionParams,
  UserSubmissionState,
} from "./MasterUserCreate.type";

import { useGetAllRolesQuery } from "@/services/master-role.service";
import {
  useCreateUserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/services/master-user.service";

/**
 * Handle form submission logic for create or update.
 * @param {UserSubmissionParams} params - Submission parameters
 * @returns {UserSubmissionState} Submission state
 */
const useUserSubmission = (
  params: UserSubmissionParams,
): UserSubmissionState => {
  const navigate = useNavigate();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Submit user form.
   * @param {SyntheticEvent} event - Submit event
   * @returns {Promise<void>} Async result
   */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const response = await sendUserMutation(params, createUser, updateUser);

      if (!response.status) {
        setErrorMessage("User request failed.");

        return;
      }

      navigate("/master-user");
    } catch {
      setErrorMessage(resolveUserSubmissionError(params.isEditMode));
    }
  };

  return { isSubmitting: isCreating || isUpdating, errorMessage, handleSubmit };
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
 * Create input event handler for string state.
 * @param {Dispatch<SetStateAction<string>>} setter - State setter
 * @returns {(event: ChangeEvent<HTMLInputElement>) => void} Event handler
 */
const _createInputSetter = (
  setter: Dispatch<SetStateAction<string>>,
): ((event: ChangeEvent<HTMLInputElement>) => void) => (
  (event: ChangeEvent<HTMLInputElement>): void => {
    setter(event.target.value);
  }
);

/**
 * Resolve initial form values from route or api.
 * @param {UserData | undefined} routeUser - Route user
 * @param {UserData | null} apiItem - API user
 * @returns {object} Initial values
 */
const _resolveInitialUserValues = (
  routeUser: UserData | undefined,
  apiItem: UserData | null,
): {
  username: string;
  email: string;
  role: string;
  isActive: boolean;
} => ({
  username: routeUser?.username ?? apiItem?.username ?? "",
  email: routeUser?.email ?? apiItem?.email ?? "",
  role: routeUser?.role ?? apiItem?.role ?? "User",
  isActive: (routeUser?.status ?? apiItem?.status) !== "inactive",
});

/**
 * Hook managing password input and visibility.
 * @returns {object} Password state and handlers
 */
const useUserPasswordInput = (): {
  password: string;
  isPasswordVisible: boolean;
  handlePasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleTogglePasswordVisibility: () => void;
} => {
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return {
    password,
    isPasswordVisible,
    handlePasswordChange: _createInputSetter(setPassword),
    /**
     *
     */
    handleTogglePasswordVisibility: (): void => {
      setIsPasswordVisible((prev) => !prev);
    },
  };
};

/**
 * Hook managing user form field input values.
 * @param {UserData | undefined} routeUser - Route user
 * @param {UserData | null} apiItem - API fetched user
 * @returns {UserFieldInputsState} Form field states and handlers
 */
const useUserFieldInputs = (
  routeUser: UserData | undefined,
  apiItem: UserData | null,
): UserFieldInputsState => {
  const init = _resolveInitialUserValues(routeUser, apiItem);
  const [username, setUsername] = useState(init.username);
  const [email, setEmail] = useState(init.email);
  const [role, setRole] = useState(init.role);
  const [isActive, setIsActive] = useState(init.isActive);
  const [initializedId, setInitializedId] = useState<string | null>(routeUser?.id ?? null);
  const passwordState = useUserPasswordInput();

  _syncUserApiData(apiItem, initializedId, {
    setInitializedId,
    setUsername,
    setEmail,
    setRole,
  });

  return {
    username,
    email,
    role,
    isActive,
    ...passwordState,
    handleUsernameChange: _createInputSetter(setUsername),
    handleEmailChange: _createInputSetter(setEmail),
    /**
     * Handle role select change.
     * @param {ChangeEvent<HTMLSelectElement>} event - Select event
     * @returns {void} No return value
     */
    handleRoleChange: (event: ChangeEvent<HTMLSelectElement>): void => {
      setRole(event.target.value);
    },
    /**
     * Handle user status toggle.
     * @returns {void} No return value
     */
    handleStatusChange: (): void => {
      setIsActive((prev) => !prev);
    },
  };
};

/**
 * Hook managing form fields and synchronization.
 * @param {UserData | undefined} routeUser - Route user
 * @param {UserData | null} apiItem - API fetched user
 * @param {object} roleOptions - Role configuration options
 * @param {UserFormFieldsState["roleOptions"]} roleOptions.options - Available roles
 * @param {boolean} roleOptions.loading - Role request loading state
 * @param {string | null} roleOptions.error - Role request error
 * @returns {UserFormFieldsState} Form fields state
 */
const useUserFormFields = (
  routeUser: UserData | undefined,
  apiItem: UserData | null,
  roleOptions: {
    options: UserFormFieldsState["roleOptions"];
    loading: boolean;
    error: string | null;
  },
): UserFormFieldsState => {
  const inputs = useUserFieldInputs(routeUser, apiItem);

  return {
    ...inputs,
    roleOptions: roleOptions.options,
    roleOptionsLoading: roleOptions.loading,
    roleOptionsError: roleOptions.error,
  };
};

/**
 * Manage master user create/edit form.
 * @returns {MasterUserCreateFormState} Form state
 */
export const useMasterUserCreateForm = (): MasterUserCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const routeUser: UserData | undefined = location.state?.user;

  const { data: detailData } = useGetUserByIdQuery(id ?? "", {
    skip: !isEditMode || !id || Boolean(routeUser),
  });

  const {
    data: roleResponse,
    error: roleError,
    isLoading: isRoleOptionsLoading,
  } = useGetAllRolesQuery();
  const roleOptions = roleResponse?.status ? roleResponse.data : [];
  const roleOptionsError = getRoleOptionsError(Boolean(roleError), roleResponse?.status);
  const apiItem = resolveUserDetail(detailData);
  const formFields = useUserFormFields(routeUser, apiItem, {
    options: roleOptions,
    loading: isRoleOptionsLoading,
    error: roleOptionsError,
  });
  const submission = useUserSubmission({ id, isEditMode, ...formFields });

  /**
   * Navigate back.
   * @returns {void} No return value
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
