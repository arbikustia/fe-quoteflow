import type { ChangeEvent, SyntheticEvent } from "react";
import { useState } from "react";
import type {
  Control,
  FieldError,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { UserData, UserRouteState } from "../MasterUser.type";

import {
  getRoleOptionsError,
  resolveUserDetail,
  resolveUserSubmissionError,
  sendUserMutation,
} from "./MasterUserCreate.helpers";
import type {
  MasterUserCreateFormState,
  UserFormFieldsState,
  UserFormHandlers,
  UserFormHandlersInput,
  UserFormValues,
  UserReferenceDataState,
  UserRouteParamsState,
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
 * Register validation rules on user form.
 *
 * @param {ReturnType<typeof useForm<UserFormValues>>["register"]} register - Register
 * @param {boolean} isEditMode - Whether edit mode
 */
const _registerUserFields = (
  register: ReturnType<typeof useForm<UserFormValues>>["register"],
  isEditMode: boolean,
): void => {
  register("username", { required: "Username is required." });
  register("email", {
    required: "Email is required.",
        /**
     * @param {string} value - Value
     * @returns {string | boolean} Resolved value
     */
    validate: (value: string): string | boolean =>
      (value.includes("@") && value.includes(".")) || "Invalid email address.",
  });
  register("role", { required: "Role is required." });

  if (!isEditMode) {
    register("password", { required: "Password is required." });
  }
};

/**
 * Create input change handler.
 *
 * @param {"username" | "email" | "password"} field - Field
 * @param {UseFormSetValue<UserFormValues>} setValue - Set value
 * @param {FieldError | undefined} error - Error
 * @returns {((event: ChangeEvent<HTMLInputElement>) => void)} Resolved value
 */
const _createFieldChange =
  (
    field: "username" | "email" | "password",
    setValue: UseFormSetValue<UserFormValues>,
    error: FieldError | undefined,
  ): ((event: ChangeEvent<HTMLInputElement>) => void) =>
  (event: ChangeEvent<HTMLInputElement>): void =>
    setValue(field, event.target.value, { shouldValidate: Boolean(error) });

/**
 * Create role select handler.
 *
 * @param {UseFormSetValue<UserFormValues>} setValue - Set value
 * @returns {((value: string | ChangeEvent<HTMLSelectElement>) => void)} Resolved value
 */
const _createRoleChange =
  (
    setValue: UseFormSetValue<UserFormValues>,
  ): ((value: string | ChangeEvent<HTMLSelectElement>) => void) =>
  (value: string | ChangeEvent<HTMLSelectElement>): void => {
    const roleValue = typeof value === "string" ? value : value.target.value;

    setValue("role", roleValue, { shouldValidate: true });
  };

/**
 * Create status toggle handler.
 *
 * @param {UseFormSetValue<UserFormValues>} setValue - Set value
 * @param {boolean} isActive - Whether active
 * @returns {(() => void)} Resolved value
 */
const _createStatusToggle =
  (
    setValue: UseFormSetValue<UserFormValues>,
    isActive: boolean,
  ): (() => void) =>
  (): void =>
    setValue("isActive", !isActive, { shouldDirty: true });

/**
 * Create form validator.
 *
 * @param {UseFormTrigger<UserFormValues>} trigger - Trigger
 * @returns {(() => Promise<boolean>)} Resolved value
 */
const _createFormValidator =
  (trigger: UseFormTrigger<UserFormValues>): (() => Promise<boolean>) =>
  async (): Promise<boolean> =>
    await trigger();

/**
 * Handle form submission logic for create or update.
 *
 * @param {UserSubmissionParams} params - Params
 * @returns {UserSubmissionState} Resolved value
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
   *
   * @param {SyntheticEvent} event - Event
   */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);

    if (!(await params.validateForm())) {
      setErrorMessage("Complete required user fields.");

      return;
    }

    try {
      const response = await sendUserMutation(params, createUser, updateUser);

      if (!response.status) {
        setErrorMessage("User request failed.");

        return;
      }

      const successMessage = params.isEditMode
        ? "User updated successfully."
        : "User created successfully.";

      navigate("/master-user", { state: { successMessage } });
    } catch {
      setErrorMessage(resolveUserSubmissionError(params.isEditMode));
    }
  };

  return { isSubmitting: isCreating || isUpdating, errorMessage, handleSubmit };
};

/**
 * Sync api user details to state.
 *
 * @param {UserData | null} apiItem - Api item
 * @param {string | null} initializedId - Initialized id
 * @param {(id: string | null) => void} setInitializedId - Set initialized id
 * @param {UseFormSetValue<UserFormValues>} setValue - Set value
 */
const _syncUserApiData = (
  apiItem: UserData | null,
  initializedId: string | null,
  setInitializedId: (id: string | null) => void,
  setValue: UseFormSetValue<UserFormValues>,
): void => {
  if (apiItem && apiItem.id !== initializedId) {
    setInitializedId(apiItem.id);
    setValue("username", apiItem.username ?? "");
    setValue("email", apiItem.email ?? "");
    setValue("role", apiItem.role ?? "User");
    setValue("isActive", apiItem.status !== "inactive");
  }
};

/**
 * Read initial form values from the route user.
 *
 * @param {UserData | undefined} routeUser - Route user
 * @returns {UserFormValues} Initial values
 */
const _getUserFormDefaults = (routeUser: UserData | undefined): UserFormValues => ({
  username: routeUser?.username ?? "",
  email: routeUser?.email ?? "",
  password: "",
  role: routeUser?.role ?? "User",
  isActive: routeUser?.status !== "inactive",
});

/**
 * Build the user form change handlers.
 *
 * @param {UserFormHandlersInput} input - Handler inputs
 * @returns {UserFormHandlers} Change handlers
 */
const _buildUserFormHandlers = (input: UserFormHandlersInput): UserFormHandlers => ({
  handleUsernameChange: _createFieldChange("username", input.setValue, input.errors.username),
  handleEmailChange: _createFieldChange("email", input.setValue, input.errors.email),
  handlePasswordChange: _createFieldChange("password", input.setValue, input.errors.password),
  /**
   * Toggle password visibility.
   *
   * @returns {void} No return value
   */
  handleTogglePasswordVisibility: (): void => input.setIsPasswordVisible((v) => !v),
  handleRoleChange: _createRoleChange(input.setValue),
  handleStatusChange: _createStatusToggle(input.setValue, input.isActive),
});

/**
 * Watch all user form values.
 *
 * @param {Control<UserFormValues>} control - Form control
 * @returns {UserFormValues} Watched values
 */
const useUserFormWatches = (control: Control<UserFormValues>): UserFormValues => ({
  username: useWatch({ control, name: "username" }),
  email: useWatch({ control, name: "email" }),
  password: useWatch({ control, name: "password" }),
  role: useWatch({ control, name: "role" }),
  isActive: useWatch({ control, name: "isActive" }),
});

/**
 * Hook managing user form fields and React Hook Form state.
 *
 * @param {UserData | undefined} routeUser - Route user
 * @param {UserData | null} apiItem - Api item
 * @param {boolean} isEditMode - Whether edit mode
 * @returns {UserFormFieldsState} Resolved value
 */
const useUserFormFields = (
  routeUser: UserData | undefined,
  apiItem: UserData | null,
  isEditMode: boolean,
): UserFormFieldsState => {
  const {
    control,
    formState: { errors, isSubmitted },
    getValues,
    register,
    setValue,
    trigger,
  } = useForm<UserFormValues>({
    defaultValues: _getUserFormDefaults(routeUser),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  _registerUserFields(register, isEditMode);
  const [initializedId, setInitializedId] = useState<string | null>(routeUser?.id ?? null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const values = useUserFormWatches(control);

  _syncUserApiData(apiItem, initializedId, setInitializedId, setValue);

  return {
    ...values,
    isPasswordVisible,
    errors,
    isSubmitted,
    getValues,
    validateForm: _createFormValidator(trigger),
    ..._buildUserFormHandlers({ setValue, errors, isActive: values.isActive, setIsPasswordVisible }),
  };
};

/**
 * Load reference data for the user form.
 *
 * @param {UserRouteParamsState} route - Route params
 * @returns {UserReferenceDataState} Loaded reference data
 */
const useUserReferenceData = (route: UserRouteParamsState): UserReferenceDataState => {
  const { data: detailData } = useGetUserByIdQuery(route.id ?? "", {
    skip: !route.isEditMode || !route.id || Boolean(route.routeUser),
  });
  const {
    data: roleResponse,
    error: roleError,
    isLoading: roleOptionsLoading,
  } = useGetAllRolesQuery();

  return {
    apiItem: resolveUserDetail(detailData),
    roleOptions: roleResponse?.status ? roleResponse.data : [],
    roleOptionsLoading,
    roleOptionsError: getRoleOptionsError(Boolean(roleError), roleResponse?.status),
  };
};

/**
 * Manage master user create/edit form.
 *
 * @returns {MasterUserCreateFormState} Resolved value
 */
export const useMasterUserCreateForm = (): MasterUserCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const routeState: UserRouteState | null = location.state;
  const routeUser = routeState?.user;
  const { apiItem, roleOptions, roleOptionsLoading, roleOptionsError } =
    useUserReferenceData({ id, isEditMode, routeUser });
  const formFields = useUserFormFields(routeUser, apiItem, isEditMode);
  const submission = useUserSubmission({ id, isEditMode, ...formFields });

  /**
   * Navigate back.
   *
   * @returns {void} No return value
   */
  const goBack = (): void => {
    navigate("/master-user");
  };

  return {
    isEditMode,
    goBack,
    roleOptions,
    roleOptionsLoading,
    roleOptionsError,
    ...formFields,
    ...submission,
  };
};
