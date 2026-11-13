import type { PermissionAction, PermissionBadgeClass } from "./Permission.type";

// Badge classes per permission action; unknown actions use DEFAULT_PERMISSION_BADGE_CLASS.
export const PERMISSION_BADGE_CLASSES: PermissionBadgeClass[] = [
  { action: "view", className: "border-information bg-information-subtle text-information-strong" },
  { action: "create", className: "border-success bg-success-subtle text-success-strong" },
  { action: "edit", className: "border-warning bg-warning-subtle text-warning-strong" },
];

export const DEFAULT_PERMISSION_BADGE_CLASS = "border-action-primary text-action-primary";

export const PERMISSION_ACTIONS: PermissionAction[] = ["view", "create", "edit"];

export const EXCLUDED_PATHS = new Set(["/permission"]);

// Pages that support fewer actions: Dashboard/Calendar/Activity Log/Report are read-only, Mail has no edit.
export const RESTRICTED_PAGE_ACTIONS = new Map<string, PermissionAction[]>([
  ["/home", ["view"]],
  ["/calendar", ["view"]],
  ["/activity-log", ["view"]],
  ["/report", ["view"]],
  ["/mail", ["view", "create"]],
]);

export const PERMISSION_USER_PAGE_SIZE = 100;

export const PERMISSION_ALL_USERS = "all";

export const PERMISSION_SAVED_MESSAGE = "Permissions saved successfully.";

export const PERMISSION_SAVE_ERROR_MESSAGE = "Unable to save permissions.";
