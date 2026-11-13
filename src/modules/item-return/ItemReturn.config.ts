import type { ReturnRowStatus } from "./ItemReturn.type";

export const RETURN_STATUS_CLASS: Record<ReturnRowStatus, string> = {
  active: "bg-success-subtle text-success-strong",
  inactive: "bg-danger-subtle text-danger-strong",
  unavailable: "bg-warning-subtle text-warning-strong",
};

export const RETURN_STATUS_LABEL: Record<ReturnRowStatus, string> = {
  active: "active",
  inactive: "inactive",
  unavailable: "Status unavailable",
};

export const RETURN_SKELETON_WIDTHS: string[] = ["w-6", "w-28", "w-24", "w-16", "w-32"];

export const RETURN_SKELETON_ROW_COUNT = 5;

export const RETURN_PAGE_SIZE_DEFAULT = 10;
