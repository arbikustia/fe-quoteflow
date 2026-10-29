import type { ReactElement } from "react";

import type { ActivityLogCardProps } from "./ActivityLog.type";

/**
 * Format activity date for mobile card.
 * @param {string} createdAt - Activity creation timestamp
 * @returns {string} Formatted date
 */
const _formatActivityDate = (createdAt: string): string => {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) return createdAt;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/**
 * Get action badge styling.
 * @param {string} action - Activity action
 * @returns {string} Action badge classes
 */
const _getActionClassName = (action: string): string => {
  const normalizedAction = action.toLowerCase();

  if (normalizedAction.includes("delete") || normalizedAction.includes("hapus")) {
    return "bg-danger-subtle text-danger-strong";
  }

  if (normalizedAction.includes("create") || normalizedAction.includes("add") || normalizedAction.includes("buat")) {
    return "bg-success-subtle text-success-strong";
  }

  if (normalizedAction.includes("update") || normalizedAction.includes("edit") || normalizedAction.includes("ubah")) {
    return "bg-warning-subtle text-warning-strong";
  }

  return "bg-information-subtle text-information-strong";
};

/**
 * Render activity log mobile card.
 * @param {ActivityLogCardProps} props - Activity log card props
 * @returns {ReactElement} Activity log card
 */
export const ActivityLogCard = ({ activity }: ActivityLogCardProps): ReactElement => (
  <article className="w-full rounded-2xl border border-border-default bg-background-surface p-5 text-left">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <h3 className="break-words text-2xl font-semibold text-text-primary">
          {activity.description}
        </h3>
        <p className="truncate text-lg text-text-secondary">
          {activity.userName}
        </p>
        <p className="truncate text-base text-text-tertiary">
          {activity.page}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${_getActionClassName(activity.action)}`}>
          {activity.action}
        </span>
        <time className="text-sm text-text-tertiary" dateTime={activity.createdAt}>
          {_formatActivityDate(activity.createdAt)}
        </time>
      </div>
    </div>
  </article>
);
