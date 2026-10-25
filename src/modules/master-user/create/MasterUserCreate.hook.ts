/* eslint-disable jsdoc/require-param-type, jsdoc/require-param-description, jsdoc/require-returns */
import type { ChangeEvent, SyntheticEvent } from "react";
import { useState } from "react";
import type { FieldError, UseFormSetValue, UseFormTrigger } from "react-hook-form";
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
  UserFormValues,
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
 * @param register
 * @param isEditMode
 */
const _registerUserFields = (register: ReturnType<typeof useForm<UserFormValues>>["register"], isEditMode: boolean): void => {
  register("username", { required: "Username is required." });
  register("email", {
    required: "Email is required.",
    /**
     *
     * @param value
     */
    validate: (value: string): string | boolean => value.includes("@") && value.includes(".") || "Invalid email address.",
  });
  register("role", { required: "Role is required." });

  if (!isEditMode) {
    register("password", { required: "Password is required." });
  }
};

/**
 * Create input change handler.
 * @param field
 * @param setValue
 * @param error
 */
const _createFieldChange = (field: "username" | "email" | "password", setValue: UseFormSetValue<UserFormValues>, error: FieldError | undefined): ((event: ChangeEvent<HTMLInputElement>) => void) => (
  (event: ChangeEvent<HTMLInputElement>): void => setValue(field, event.target.value, { shouldValidate: Boolean(error) })
);

/**
 * Create role select handler.
 * @param setValue
 */
const _createRoleChange = (setValue: UseFormSetValue<UserFormValues>): ((value: string | ChangeEvent<HTMLSelectElement>) => void) => (
  (value: string | ChangeEvent<HTMLSelectElement>): void => {
    const roleValue = typeof value === "string" ? value : value.target.value;

    setValue("role", roleValue, { shouldValidate: true });
  }
);

/**
 * Create status toggle handler.
 * @param setValue
 * @param isActive
 */
const _createStatusToggle = (setValue: UseFormSetValue<UserFormValues>, isActive: boolean): (() => void) => (
  (): void => setValue("isActive", !isActive, { shouldDirty: true })
);

/**
 * Create form validator.
 * @param trigger
 */
const _createFormValidator = (trigger: UseFormTrigger<UserFormValues>): (() => Promise<boolean>) => (
  async (): Promise<boolean> => await trigger()
);

/**
 * Handle form submission logic for create or update.
 * @param params
 */
const useUserSubmission = (params: UserSubmissionParams): UserSubmissionState => {
  const navigate = useNavigate();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Submit user form.
   * @param event
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

      const successMessage = params.isEditMode ? "User updated successfully." : "User created successfully.";

      navigate("/master-user", { state: { successMessage } });
    } catch {
      setErrorMessage(resolveUserSubmissionError(params.isEditMode));
    }
  };

  return { isSubmitting: isCreating || isUpdating, errorMessage, handleSubmit };
};

/**
 * Sync api user details to state.
 * @param apiItem
 * @param initializedId
 * @param setInitializedId
 * @param setValue
 */
const _syncUserApiData = (apiItem: UserData | null, initializedId: string | null, setInitializedId: (id: string | null) => void, setValue: UseFormSetValue<UserFormValues>): void => {
  if (apiItem && apiItem.id !== initializedId) {
    setInitializedId(apiItem.id);
    setValue("username", apiItem.username ?? "");
    setValue("email", apiItem.email ?? "");
    setValue("role", apiItem.role ?? "User");
    setValue("isActive", apiItem.status !== "inactive");
  }
};

/**
 * Hook managing user form fields and React Hook Form state.
 * @param routeUser
 * @param apiItem
 * @param isEditMode
 */
const useUserFormFields = (routeUser: UserData | undefined, apiItem: UserData | null, isEditMode: boolean): UserFormFieldsState => {
  const { control, formState: { errors, isSubmitted }, getValues, register, setValue, trigger } = useForm<UserFormValues>({
    defaultValues: { username: routeUser?.username ?? "", email: routeUser?.email ?? "", password: "", role: routeUser?.role ?? "User", isActive: routeUser?.status !== "inactive" },
    mode: "onSubmit", reValidateMode: "onChange",
  });

  _registerUserFields(register, isEditMode);
  const [initializedId, setInitializedId] = useState<string | null>(routeUser?.id ?? null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const username = useWatch({ control, name: "username" });
  const email = useWatch({ control, name: "email" });
  const password = useWatch({ control, name: "password" });
  const role = useWatch({ control, name: "role" });
  const isActive = useWatch({ control, name: "isActive" });

  _syncUserApiData(apiItem, initializedId, setInitializedId, setValue);

  return {
    username, email, password, isPasswordVisible, role, isActive, errors, isSubmitted, getValues,
    validateForm: _createFormValidator(trigger),
    handleUsernameChange: _createFieldChange("username", setValue, errors.username),
    handleEmailChange: _createFieldChange("email", setValue, errors.email),
    handlePasswordChange: _createFieldChange("password", setValue, errors.password),
    /**
     *
     */
    handleTogglePasswordVisibility: (): void => setIsPasswordVisible((v) => !v),
    handleRoleChange: _createRoleChange(setValue),
    handleStatusChange: _createStatusToggle(setValue, isActive),
  };
};

/** Manage master user create/edit form. */
export const useMasterUserCreateForm = (): MasterUserCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const routeState: UserRouteState | null = location.state;
  const routeUser = routeState?.user;
  const { data: detailData } = useGetUserByIdQuery(id ?? "", { skip: !isEditMode || !id || Boolean(routeUser) });
  const { data: roleResponse, error: roleError, isLoading: roleOptionsLoading } = useGetAllRolesQuery();
  const roleOptions = roleResponse?.status ? roleResponse.data : [];
  const roleOptionsError = getRoleOptionsError(Boolean(roleError), roleResponse?.status);
  const formFields = useUserFormFields(routeUser, resolveUserDetail(detailData), isEditMode);
  const submission = useUserSubmission({ id, isEditMode, ...formFields });

  /** Navigate back. */
  const goBack = (): void => { navigate(-1); };

  return { isEditMode, goBack, roleOptions, roleOptionsLoading, roleOptionsError, ...formFields, ...submission };
};
