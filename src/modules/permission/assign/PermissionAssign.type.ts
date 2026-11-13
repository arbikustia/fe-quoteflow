import type { SelectOption } from "@/components/Select/Select.type";

import type { PermissionAction, PermissionFormPage } from "../Permission.type";

export type PermissionEditedPages = {
  source: PermissionFormPage[];
  pages: PermissionFormPage[];
};

export type PermissionAssignFormState = {
  formPages: PermissionFormPage[];
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  onSelectAllChange: (checked: boolean) => void;
  onRowSelectChange: (url: string, checked: boolean) => void;
  onPermissionChange: (url: string, permission: PermissionAction, checked: boolean) => void;
};

export type PermissionAssignSaveState = {
  isSubmitting: boolean;
  formMessage?: string;
  onSubmit: () => Promise<void>;
};

export type PermissionAssignState = PermissionAssignFormState & PermissionAssignSaveState & {
  username: string;
  userOptions: SelectOption[];
  isLoadingUsers: boolean;
  onUserChange: (username: string) => void;
  onUserSearch: (search: string) => void;
  onCancel: () => void;
};
