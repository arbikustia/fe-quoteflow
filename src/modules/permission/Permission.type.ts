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

export type PermissionBadgeClass = {
  action: PermissionAction;
  className: string;
};

export type PermissionFormPage = {
  menu: string;
  number: number;
  page: string;
  url: string;
  actions: PermissionAction[];
  permission: PermissionAction[];
};

export type PermissionPayloadMenu = {
  menu: string;
  number: number;
  pages: ApiPermissionPage[];
};

export type PermissionPayload = {
  username: string;
  menus: PermissionPayloadMenu[];
};

export type PermissionCounts = {
  selected: number;
  total: number;
};

export type PermissionRouteState = {
  message?: string;
};

export type PermissionNavigateOptions = {
  state: PermissionRouteState;
};

export type PermissionNavigate = (path: string, options?: PermissionNavigateOptions) => void | Promise<void>;

export type PermissionUsersState = {
  userOptions: SelectOption[];
  isLoadingUsers: boolean;
  isUsersError: boolean;
  onUserSearch: (username: string) => void;
};

export type PermissionRowsState = {
  rows: PermissionRow[];
  isLoadingPermission: boolean;
  isPermissionError: boolean;
};

export type PermissionState = {
  selectedUsername: string;
  userOptions: SelectOption[];
  rows: PermissionRow[];
  isLoadingUsers: boolean;
  isLoadingPermission: boolean;
  errorMessage?: string;
  formMessage?: string;
  isEmpty: boolean;
  onUsernameChange: (username: string) => void;
  onUserSearch: (username: string) => void;
  onSearchChange: (searchTerm: string) => void;
  onOpenForm: () => void;
  onBack: () => void;
};
