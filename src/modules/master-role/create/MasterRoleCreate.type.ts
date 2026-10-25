import type * as React from "react";

export type MasterRoleCreateFormState = {
  roleName: string;
  isActive: boolean;
  isEditMode: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  errors: import("react-hook-form").FieldErrors<import("../MasterRole.type").RoleFormValues>;
  isSubmitted: boolean;
  handleRoleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: () => void;
  handleSubmit: (event: React.SyntheticEvent) => Promise<void>;
  goBack: () => void;
};
