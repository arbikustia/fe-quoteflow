import type { ChecklistRowStatus, ChecklistStatusConfig } from "./ItemChecklist.type";

export const CHECKLIST_STATUS_CONFIG: Record<ChecklistRowStatus, ChecklistStatusConfig> = {
  active: { label: "Done", className: "bg-success-subtle text-success-strong" },
  inactive: { label: "On Progress", className: "bg-info-subtle text-info-strong" },
  unavailable: { label: "Pending", className: "bg-warning-subtle text-warning-strong" },
};

export const CHECKLIST_API_STATUS: Record<number, ChecklistRowStatus> = {
  1: "inactive",
  2: "active",
};
