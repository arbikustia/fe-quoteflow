import type { SelectOption } from "@/components/Select/Select.component";

import type { PermissionAction, PermissionFormPage } from "../Permission.type";

export type PermissionAssignState = {
  username: string;
  formPages: PermissionFormPage[];
  isSubmitting: boolean;
  formMessage?: string;
  userOptions: SelectOption[];
  isLoadingUsers: boolean;
  onUserChange: (username: string) => void;
  onUserSearch: (search: string) => void;
  onPermissionChange: (url: string, permission: PermissionAction, checked: boolean) => void;
  onSubmit: () => void;
  onCancel: () => void;
};
