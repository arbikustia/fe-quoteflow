import type * as React from "react";

export type MasterUserCreateFormState = {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly isPasswordVisible: boolean;
  readonly role: string;
  readonly isActive: boolean;
  readonly isEditMode: boolean;
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly handleUsernameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handlePasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleTogglePasswordVisibility: () => void;
  readonly handleRoleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  readonly handleStatusChange: () => void;
  readonly handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
  readonly goBack: () => void;
};
