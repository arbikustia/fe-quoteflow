import type { ChangeEvent, SubmitEvent } from "react";
import { z } from "zod";

import { ROLE_ACTIVE_STATUS } from "../MasterRole.config";
import type { RoleCreatePayload, RoleMutationResponse, RoleUpdatePayload } from "../MasterRole.type";
import { ApiRoleSchema } from "../MasterRole.type";

import { ROLE_FORM_MESSAGE } from "./MasterRoleCreate.config";

/** Role form input. */
export const RoleFormSchema = z.object({
  name: z.string().trim().min(1, ROLE_FORM_MESSAGE.NAME_REQUIRED),
  isActive: z.boolean(),
});

/** Raw form values. */
export type RoleFormValues = z.input<typeof RoleFormSchema>;

/** Form values after validation. */
export type RoleValidValues = z.output<typeof RoleFormSchema>;

/** Form field names. */
export type RoleFieldName = keyof RoleFormValues;

/** Validation message per field. */
export type RoleFieldErrors = Partial<Record<RoleFieldName, string>>;

/** Role returned by the detail endpoint, normalized into form values. */
export const RoleFormItemSchema = ApiRoleSchema.transform((role): RoleFormValues => ({
  name: role.role ?? "",
  isActive: role.status === ROLE_ACTIVE_STATUS,
}));

/** Whether the form creates a new role or edits an existing one. */
export type RoleFormMode = "create" | "edit";

/** Whether the form can be shown. */
export type RoleFormStatus = "loading" | "error" | "ready";

/** Copy that differs between create and edit mode. */
export type RoleFormModeText = {
  title: string;
  subtitle: string;
  submitLabel: string;
  submittingLabel: string;
  successMessage: string;
  failureMessage: string;
};

/** Normalized form source used to seed the form. */
export type RoleFormSource = {
  formStatus: RoleFormStatus;
  initialValues: RoleFormValues;
};

/** Inputs of the form source normalizer. */
export type RoleFormSourceParams = {
  data?: RoleMutationResponse;
  isLoading: boolean;
  isError: boolean;
};

/** Result of an RTK Query mutation trigger. */
export type RoleMutationResult = {
  unwrap: () => Promise<RoleMutationResponse>;
};

/** Mutation triggers and target of a role submit. */
export type RoleSubmitTarget = {
  id?: string;
  createRole: (payload: RoleCreatePayload) => RoleMutationResult;
  updateRole: (payload: RoleUpdatePayload) => RoleMutationResult;
};

/** Inputs of the create / edit form hook. */
export type MasterRoleCreateParams = RoleSubmitTarget & {
  mode: RoleFormMode;
  initialValues: RoleFormValues;
};

/** Submit state and handlers of the form. */
export type RoleSubmission = {
  errorMessage?: string;
  submitRole: (values: RoleValidValues) => Promise<void>;
  handleBack: () => void;
};

/** Form state and handlers owned by the module hook. */
export type MasterRoleCreateController = {
  values: RoleFormValues;
  fieldErrors: RoleFieldErrors;
  errorMessage?: string;
  handleNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: (checked: boolean) => void;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  handleBack: () => void;
};

/** Props of the create / edit form view. */
export type MasterRoleCreateProps = {
  mode: RoleFormMode;
  formStatus: RoleFormStatus;
  values: RoleFormValues;
  fieldErrors: RoleFieldErrors;
  isSubmitting: boolean;
  errorMessage?: string;
  onNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (checked: boolean) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  onBack: () => void;
};
