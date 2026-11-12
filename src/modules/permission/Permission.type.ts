import type { SelectOption } from "@/components/Select/Select.type";

export type ApiPermissionPage = {
  url: string;
  page: string;
  permission: string[];
};

export type ApiPermissionMenu = {
  menu: string;
  pages: ApiPermissionPage[];
};

export type UserPermission = {
  username: string;
  menus: ApiPermissionMenu[];
};

export type UserPermissionResponse = {
  status: boolean;
  data?: UserPermission;
  messages: string[];
};

export type PermissionRow = {
  id: string;
  menu: string;
  page: string;
  url: string;
  permission: string[];
};

export type PermissionAction = "view" | "create" | "edit";

export type PermissionFormPage = {
  menu: string;
  number: number;
  page: string;
  url: string;
  actions: PermissionAction[];
  permission: PermissionAction[];
};

export type PermissionPayload = {
  username: string;
  menus: Array<{
    menu: string;
    number: number;
    pages: ApiPermissionPage[];
  }>;
};

export type PermissionState = {
  selectedUsername: string;
  userOptions: SelectOption[];
  rows: PermissionRow[];
  formPages: PermissionFormPage[];
  isFormOpen: boolean;
  isLoadingUsers: boolean;
  isLoadingPermission: boolean;
  isSubmitting: boolean;
  errorMessage?: string;
  formMessage?: string;
  isEmpty: boolean;
  searchTerm: string;
  onUsernameChange: (username: string) => void;
  onUserSearch: (username: string) => void;
  onSearchChange: (searchTerm: string) => void;
  onOpenForm: () => void;
  onCloseForm: () => void;
  onPermissionChange: (url: string, permission: PermissionAction, checked: boolean) => void;
  onSubmit: () => void;
  onBack: () => void;
};
