import type { ChangeEvent, SyntheticEvent } from "react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { MasterRoleCreateFormState } from "./MasterRoleCreate.type";

import type {
  RoleCreateResponse,
  RoleData,
  RoleDetailResponse,
  RoleFormFieldsState,
  RoleSubmissionParams,
  RoleSubmissionState,
} from "../MasterRole.type";

import {
  mapRole,
  useCreateRoleMutation,
  useGetRoleByIdQuery,
  useUpdateRoleMutation,
} from "@/services/master-role.service";

/**
 * Format backend messages into a display string.
 * @param {string[] | string | null} messages - Backend messages
 * @returns {string} Formatted message
 */
const _formatMessages = (messages: string[] | string | null): string => {
  if (Array.isArray(messages)) {
    return messages.join(" ");
  }

  return messages ?? "Role request failed.";
};

/**
 * Resolve detail response into single UI role.
 * @param {RoleDetailResponse | undefined} response - Detail response
 * @returns {RoleData | null} Role or null
 */
const _resolveRoleDetail = (response: RoleDetailResponse | undefined): RoleData | null => {
  if (!response?.status || !response.data) {
    return null;
  }

  const rawItem = Array.isArray(response.data) ? response.data[0] : response.data;

  return rawItem ? mapRole(rawItem) : null;
};

/**
 * Handle form submission logic for create or update.
 * @param {RoleSubmissionParams} params - Submission parameters
 * @returns {RoleSubmissionState} Submission state
 */
const useRoleSubmission = (
  params: RoleSubmissionParams,
): RoleSubmissionState => {
  const { id, isEditMode, roleName, isActive } = params;
  const navigate = useNavigate();
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSubmitting = isCreating || isUpdating;

  /**
   * Submit role form.
   * @param {SyntheticEvent} event - Submit event
   * @returns {Promise<void>} Async result
   */
  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    setErrorMessage(null);

    if (!roleName.trim()) {
      setErrorMessage("Role name is required.");

      return;
    }

    try {
      let response: RoleCreateResponse;

      if (isEditMode && id) {
        response = await updateRole({ id, role: roleName, status: isActive ? 1 : 0 }).unwrap();
      } else {
        response = await createRole({ role: roleName, status: 1 }).unwrap();
      }

      if (!response.status) {
        setErrorMessage(_formatMessages(response.messages));

        return;
      }

      navigate("/master-role");
    } catch {
      setErrorMessage(isEditMode ? "Unable to update role. Please try again." : "Unable to create role. Please try again.");
    }
  };

  return { isSubmitting, errorMessage, handleSubmit };
};

/**
 * Hook managing form fields and synchronization.
 * @param {RoleData | undefined} routeRole - Route role
 * @param {RoleData | null} apiItem - API fetched role
 * @returns {RoleFormFieldsState} Form fields state
 */
const useRoleFormFields = (
  routeRole: RoleData | undefined,
  apiItem: RoleData | null,
): RoleFormFieldsState => {
  const initialRoleName = routeRole?.roleName ?? apiItem?.roleName ?? "";
  const initialIsActive = routeRole ? routeRole.status === "active" : (apiItem ? apiItem.status === "active" : true);

  const [roleName, setRoleName] = useState(initialRoleName);
  const [isActive, setIsActive] = useState(initialIsActive);
  const [initializedId, setInitializedId] = useState<string | null>(routeRole?.id ?? null);

  if (apiItem && apiItem.id !== initializedId) {
    setInitializedId(apiItem.id);
    setRoleName(apiItem.roleName);
    setIsActive(apiItem.status === "active");
  }

  const handleRoleNameChange = (e: ChangeEvent<HTMLInputElement>): void => { setRoleName(e.target.value); };
  const handleStatusChange = (): void => { setIsActive((current) => !current); };

  return { roleName, isActive, handleRoleNameChange, handleStatusChange };
};

/**
 * Hook managing master role form state.
 * @returns {MasterRoleCreateFormState} Form state
 */
export const useMasterRoleCreateForm = (): MasterRoleCreateFormState => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ readonly id?: string }>();
  const isEditMode = Boolean(id);
  const routeRole: RoleData | undefined = location.state?.role;

  const { data: detailData } = useGetRoleByIdQuery(id ?? "", {
    skip: !isEditMode || !id || Boolean(routeRole),
  });

  const apiItem = _resolveRoleDetail(detailData);
  const formFields = useRoleFormFields(routeRole, apiItem);
  const submission = useRoleSubmission({ id, isEditMode, ...formFields });

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
