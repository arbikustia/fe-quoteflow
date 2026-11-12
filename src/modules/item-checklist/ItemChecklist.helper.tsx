import type { ReactElement } from "react";

import { formatIndonesianDateTime } from "@/utils/date.helpers";

import { CHECKLIST_STATUS_CONFIG } from "./ItemChecklist.config";
import type { ChecklistStatusBadgeProps, ItemChecklistMobileCardProps } from "./ItemChecklist.type";

/**
 * Render checklist status badge.
 * @param {ChecklistStatusBadgeProps} props - Badge props
 * @returns {ReactElement} Status badge
 */
export const ChecklistStatusBadge = ({ status }: ChecklistStatusBadgeProps): ReactElement => {
  const { label, className } = CHECKLIST_STATUS_CONFIG[status];

  return <span className={`inline-flex rounded-full border border-current px-3 py-1 text-base font-semibold uppercase ${className}`}>{label}</span>;
};

/**
 * Render mobile checklist card.
 * @param {ItemChecklistMobileCardProps} props - Mobile card props
 * @returns {ReactElement} Mobile card element
 */
export const ItemChecklistMobileCard = ({ row, onClick }: ItemChecklistMobileCardProps): ReactElement => {
  /**
   * Open the checklist row.
   * @returns {void} No return value
   */
  const handleClick = (): void => onClick(row);

  return (
    <button type="button" onClick={handleClick} className="group block w-full min-w-0 rounded-3xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary">
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-3"><span className="min-w-0 break-words text-xl font-semibold text-text-primary">{row.checklistNo}</span><ChecklistStatusBadge status={row.status} /></span>
      <span className="mt-1.5 block break-words text-lg text-text-secondary">{row.customerName || "No customer name"}</span>
      <span className="mt-4 block text-lg text-text-secondary">{row.itemCount} items</span>
      <span className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-border-default pt-4 text-lg text-text-secondary">
        <span className="min-w-0"><span className="block text-lg text-text-tertiary">Checklist date</span><span className="mt-1 block font-medium text-text-primary">{formatIndonesianDateTime(row.checklistDate)}</span></span>
      </span>
    </button>
  );
};
