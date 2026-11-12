import type { PermissionAction } from "./Permission.type";

// Badge classes per permission action; unknown actions use DEFAULT_PERMISSION_BADGE_CLASS.
export const PERMISSION_BADGE_CLASSES: { action: PermissionAction; className: string }[] = [
  { action: "view", className: "border-information bg-information-subtle text-information-strong" },
  { action: "create", className: "border-success bg-success-subtle text-success-strong" },
  { action: "edit", className: "border-warning bg-warning-subtle text-warning-strong" },
];

export const DEFAULT_PERMISSION_BADGE_CLASS = "border-action-primary text-action-primary";
