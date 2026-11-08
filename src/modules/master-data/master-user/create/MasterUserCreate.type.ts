import type * as React from "react";
import type { ChangeEvent, SyntheticEvent } from "react";
import type { FieldErrors, UseFormSetValue } from "react-hook-form";

import type { RoleOption } from "../../master-role/MasterRole.type";
import type { UserData } from "../MasterUser.type";

export type UserFormFieldsState = UserFormValues & UserFormValidation & {
  isPasswordVisible: boolean;
  getValues: () => UserFormValues;
  validateForm: () => Promise<boolean>;
  handleUsernameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleTogglePasswordVisibility: () => void;
  handleRoleChange: (value: string | ChangeEvent<HTMLSelectElement>) => void;
  handleStatusChange: () => void;
};

export type UserFormValues = {
  username: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
};

export type UserSubmissionParams = {
  id: string | undefined;
  isEditMode: boolean;
  isActive: boolean;
  getValues: () => UserFormValues;
  validateForm: () => Promise<boolean>;
};

export type UserFormValidation = {
  errors: import("react-hook-form").FieldErrors<UserFormValues>;
  isSubmitted: boolean;
};

export type UserSubmissionState = {
  isSubmitting: boolean;
  errorMessage: string | null;
  handleSubmit: (event: SyntheticEvent) => Promise<void>;
};

export type UserFormHandlers = Pick<
  UserFormFieldsState,
  | "handleUsernameChange"
  | "handleEmailChange"
  | "handlePasswordChange"
  | "handleTogglePasswordVisibility"
  | "handleRoleChange"
  | "handleStatusChange"
>;

export type UserFormHandlersInput = {
  setValue: UseFormSetValue<UserFormValues>;
  errors: FieldErrors<UserFormValues>;
  isActive: boolean;
  setIsPasswordVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export type UserRouteParamsState = {
  id: string | undefined;
  isEditMode: boolean;
  routeUser: UserData | undefined;
};

export type UserReferenceDataState = {
  apiItem: UserData | null;
  roleOptions: RoleOption[];
  roleOptionsLoading: boolean;
  roleOptionsError: string | null;
};

export type UserFieldInputsState = {
  username: string;
  email: string;
  password: string;
  isPasswordVisible: boolean;
  role: string;
  isActive: boolean;
  handleUsernameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleTogglePasswordVisibility: () => void;
  handleRoleChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleStatusChange: () => void;
};


export type MasterUserCreateFormState = {
  username: string;
  email: string;
  password: string;
  isPasswordVisible: boolean;
  role: string;
  roleOptions: RoleOption[];
  roleOptionsLoading: boolean;
  roleOptionsError: string | null;
  isActive: boolean;
  isEditMode: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  errors: import("react-hook-form").FieldErrors<UserFormValues>;
  isSubmitted: boolean;
  handleUsernameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleTogglePasswordVisibility: () => void;
  handleRoleChange: (value: string | ChangeEvent<HTMLSelectElement>) => void;
  handleStatusChange: () => void;
  handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
  goBack: () => void;
};
