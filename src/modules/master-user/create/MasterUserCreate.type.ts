import type * as React from "react";
import type { ChangeEvent, SyntheticEvent } from "react";

import type { RoleOption } from "../../master-role/MasterRole.type";

export type UserFormFieldsState = {
  username: string;
  email: string;
  password: string;
  isPasswordVisible: boolean;
  role: string;
  roleOptions: readonly RoleOption[];
  roleOptionsLoading: boolean;
  roleOptionsError: string | null;
  isActive: boolean;
  handleUsernameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleTogglePasswordVisibility: () => void;
  handleRoleChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleStatusChange: () => void;
};

export type UserSubmissionParams = {
  id: string | undefined;
  isEditMode: boolean;
  username: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
};

export type UserSubmissionState = {
  isSubmitting: boolean;
  errorMessage: string | null;
  handleSubmit: (event: SyntheticEvent) => Promise<void>;
};

export type MasterUserCreateFormState = {
  username: string;
  email: string;
  password: string;
  isPasswordVisible: boolean;
  role: string;
  roleOptions: readonly RoleOption[];
  roleOptionsLoading: boolean;
  roleOptionsError: string | null;
  isActive: boolean;
  isEditMode: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  handleUsernameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleTogglePasswordVisibility: () => void;
  handleRoleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleStatusChange: () => void;
  handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
  goBack: () => void;
};
