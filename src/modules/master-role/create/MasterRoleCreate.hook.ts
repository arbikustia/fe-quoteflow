/* eslint-disable jsdoc/require-param, jsdoc/require-returns */
import type { ChangeEvent, SyntheticEvent } from "react";
import { useState } from "react";
import type { FieldError, UseFormSetValue, UseFormTrigger } from "react-hook-form";
import { useForm, useWatch } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type {
  RoleCreateResponse,
  RoleData,
  RoleDetailResponse,
  RoleFormFieldsState,
  RoleFormValues,
  RoleRouteState,
  RoleSubmissionParams,
  RoleSubmissionState,
} from "../MasterRole.type";

import type { MasterRoleCreateFormState } from "./MasterRoleCreate.type";

import {
  mapRole,
  useCreateRoleMutation,
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
} from "@/services/master-role.service";

/**
 * Format backend messages into display text.
 * @param {string[] | string | null} messages - Backend messages
 * @returns {string} Display message
 */
const _formatMessages = (messages: string[] | string | null): string => Array.isArray(messages)
  ? messages.join(" ")
  : (messages ?? "Role request failed.");

/**
 * Resolve detail response into role data.
 * @param {RoleDetailResponse | undefined} response - Detail response
 * @returns {RoleData | null} Role data
 */
const _resolveRoleDetail = (response: RoleDetailResponse | undefined): RoleData | null => {
  if (!response?.status || !response.data) return null;

  const rawItem = Array.isArray(response.data) ? response.data[0] : response.data;

  return rawItem ? mapRole(rawItem) : null;
};

/** Register role validation rules. */
const _registerRoleFields = (register: ReturnType<typeof useForm<RoleFormValues>>["register"]): void => {
  register("roleName", { required: "Role name is required." });
};

/** Create role name change handler. */
const _createRoleNameChange = (setValue: UseFormSetValue<RoleFormValues>, error: FieldError | undefined): ((event: ChangeEvent<HTMLInputElement>) => void) => (
  (event: ChangeEvent<HTMLInputElement>): void => setValue("roleName", event.target.value, { shouldValidate: Boolean(error) })
);

/** Create status toggle handler. */
const _createStatusToggle = (setValue: UseFormSetValue<RoleFormValues>, isActive: boolean): (() => void) => (
  (): void => setValue("isActive", !isActive, { shouldDirty: true })
);

/** Create form validation trigger. */
const _createFormValidator = (trigger: UseFormTrigger<RoleFormValues>): (() => Promise<boolean>) => (
  async (): Promise<boolean> => await trigger()
);

/** Synchronize fetched role into form. */
const _syncApiRole = (apiItem: RoleData | null, initializedId: string | null, setInitializedId: (id: string | null) => void, setValue: UseFormSetValue<RoleFormValues>): void => {
  if (!apiItem || apiItem.id === initializedId) return;

  setInitializedId(apiItem.id);
  setValue("roleName", apiItem.roleName);
  setValue("isActive", apiItem.status === "active");
};

/** Send create or update mutation. */
const _sendRoleMutation = (params: RoleSubmissionParams, createRole: ReturnType<typeof useCreateRoleMutation>[0], updateRole: ReturnType<typeof useUpdateRoleMutation>[0]): Promise<RoleCreateResponse> => {
  const values = params.getValues();

  if (params.isEditMode && params.id) {
    return updateRole({ id: params.id, role: values.roleName, status: params.isActive ? 1 : 0 }).unwrap();
  }

  return createRole({ role: values.roleName, status: 1 }).unwrap();
};

/** Manage role submission. */
const useRoleSubmission = (params: RoleSubmissionParams): RoleSubmissionState => {
  const navigate = useNavigate();
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /** Submit role form. */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);

    if (!(await params.validateForm())) {
      setErrorMessage("Role name is required.");

      return;
    }

    try {
      const response = await _sendRoleMutation(params, createRole, updateRole);

      if (!response.status) {
        setErrorMessage(_formatMessages(response.messages));

        return;
      }

      const successMessage = params.isEditMode ? "Role updated successfully." : "Role created successfully.";

      navigate("/master-role", { state: { successMessage } });
    } catch {
      setErrorMessage(params.isEditMode ? "Unable to update role. Please try again." : "Unable to create role. Please try again.");
    }
  };

  return { isSubmitting: isCreating || isUpdating, errorMessage, handleSubmit };
};

/** Manage role form fields. */
const useRoleFormFields = (routeRole: RoleData | undefined, apiItem: RoleData | null): RoleFormFieldsState => {
  const { control, formState: { errors, isSubmitted }, getValues, register, setValue, trigger } = useForm<RoleFormValues>({
    defaultValues: { roleName: routeRole?.roleName ?? "", isActive: routeRole?.status !== "inactive" },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  _registerRoleFields(register);
  const [initializedId, setInitializedId] = useState<string | null>(routeRole?.id ?? null);
  const roleName = useWatch({ control, name: "roleName" });
  const isActive = useWatch({ control, name: "isActive" });

  _syncApiRole(apiItem, initializedId, setInitializedId, setValue);

  return { roleName, isActive, errors, isSubmitted, getValues, validateForm: _createFormValidator(trigger), handleRoleNameChange: _createRoleNameChange(setValue, errors.roleName), handleStatusChange: _createStatusToggle(setValue, isActive) };
};

/** Provide master role form state. */
export const useMasterRoleCreateForm = (): MasterRoleCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const routeState: RoleRouteState | null = location.state;
  const routeRole = routeState?.role;
  const { data: detailData } = useGetRoleByIdQuery(id ?? "", { skip: !isEditMode || !id || Boolean(routeRole) });
  const formFields = useRoleFormFields(routeRole, _resolveRoleDetail(detailData));
  const submission = useRoleSubmission({ id, isEditMode, ...formFields });

  /** Navigate back. */
  const goBack = (): void => { navigate(-1); };

  return { isEditMode, goBack, ...formFields, ...submission };
};
