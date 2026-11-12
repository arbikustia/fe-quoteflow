import type { ChangeEvent, SubmitEvent } from "react";
import { z } from "zod";

import type { SelectOption } from "@/components/Select/Select.type";

import type { RoleAllResponse } from "../../master-role/MasterRole.type";
import { USER_INACTIVE_STATUS } from "../MasterUser.config";
import type { UserCreatePayload, UserMutationResponse, UserUpdatePayload } from "../MasterUser.type";
import { ApiUserSchema } from "../MasterUser.type";

import { USER_FORM_MESSAGE } from "./MasterUserCreate.config";

/** User form input shared by both modes; the password is only checked in create mode. */
export const UserFormSchema = z.object({
  username: z.string().trim().min(1, USER_FORM_MESSAGE.USERNAME_REQUIRED),
  email: z.string().trim().min(1, USER_FORM_MESSAGE.EMAIL_REQUIRED).pipe(z.email(USER_FORM_MESSAGE.EMAIL_INVALID)),
  password: z.string(),
  role: z.string().min(1, USER_FORM_MESSAGE.ROLE_REQUIRED),
  isActive: z.boolean(),
});

/** Create form input: the password is required. */
export const UserCreateFormSchema = UserFormSchema.extend({
  password: z.string().min(1, USER_FORM_MESSAGE.PASSWORD_REQUIRED),
});

/** Raw form values. */
export type UserFormValues = z.input<typeof UserFormSchema>;

/** Form values after validation. */
export type UserValidValues = z.output<typeof UserFormSchema>;

/** Form field names. */
export type UserFieldName = keyof UserFormValues;

/** Form fields edited through a text input. */
export type UserTextFieldName = "username" | "email" | "password";

/** Validation message per field. */
export type UserFieldErrors = Partial<Record<UserFieldName, string>>;

/** User returned by the detail endpoint, normalized into form values. */
export const UserFormItemSchema = ApiUserSchema.transform((user): UserFormValues => ({
  username: user.username ?? "",
  email: user.email ?? "",
  password: "",
  role: (Array.isArray(user.role) ? user.role[0] : user.role) ?? "",
  isActive: user.status !== USER_INACTIVE_STATUS,
}));

/** Whether the form creates a new user or edits an existing one. */
export type UserFormMode = "create" | "edit";

/** Whether the form can be shown. */
export type UserFormStatus = "loading" | "error" | "ready";

/** Copy that differs between create and edit mode. */
export type UserFormModeText = {
  title: string;
  subtitle: string;
  submitLabel: string;
  submittingLabel: string;
  successMessage: string;
  failureMessage: string;
};

/** Normalized form source used to seed the form. */
export type UserFormSource = {
  formStatus: UserFormStatus;
  initialValues: UserFormValues;
};

/** Inputs of the form source normalizer. */
export type UserFormSourceParams = {
  data?: UserMutationResponse;
  isLoading: boolean;
  isError: boolean;
};

/** Inputs of the role option normalizer. */
export type UserRoleOptionsParams = {
  data?: RoleAllResponse;
  isLoading: boolean;
  isError: boolean;
};

/** Role select options and their load state. */
export type UserRoleOptions = {
  roleOptions: SelectOption[];
  isRoleOptionsLoading: boolean;
  roleOptionsError?: string;
};

/** Result of an RTK Query mutation trigger. */
export type UserMutationResult = {
  unwrap: () => Promise<UserMutationResponse>;
};

/** Mutation triggers and target of a user submit. */
export type UserSubmitTarget = {
  id?: string;
  createUser: (payload: UserCreatePayload) => UserMutationResult;
  updateUser: (payload: UserUpdatePayload) => UserMutationResult;
};

/** Inputs of the create / edit form hook. */
export type MasterUserCreateParams = UserSubmitTarget & {
  mode: UserFormMode;
  initialValues: UserFormValues;
};

/** Submit state and handlers of the form. */
export type UserSubmission = {
  errorMessage?: string;
  submitUser: (values: UserValidValues) => Promise<void>;
  handleBack: () => void;
};

/** Field change handlers of the form. */
export type UserFieldHandlers = {
  handleUsernameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleRoleChange: (role: string) => void;
  handleStatusChange: (checked: boolean) => void;
};

/** Form state and handlers owned by the module hook. */
export type MasterUserCreateController = UserFieldHandlers & {
  values: UserFormValues;
  fieldErrors: UserFieldErrors;
  isPasswordVisible: boolean;
  errorMessage?: string;
  handleTogglePasswordVisibility: () => void;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  handleBack: () => void;
};

/** Props of the create / edit form view. */
export type MasterUserCreateProps = UserRoleOptions & {
  mode: UserFormMode;
  formStatus: UserFormStatus;
  values: UserFormValues;
  fieldErrors: UserFieldErrors;
  isPasswordVisible: boolean;
  isSubmitting: boolean;
  errorMessage?: string;
  onUsernameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onTogglePasswordVisibility: () => void;
  onRoleChange: (role: string) => void;
  onStatusChange: (checked: boolean) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
  onBack: () => void;
};
