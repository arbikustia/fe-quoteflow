import type * as React from "react";

export type MasterUserCreateFormState = {
  readonly username: string;
  readonly password: string;
  readonly role: "Admin" | "User";
  readonly isEdit: boolean;
  readonly handleUsernameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handlePasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly handleRoleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  readonly handleSubmit: (event: React.SyntheticEvent) => void;
  readonly goBack: () => void;
};
