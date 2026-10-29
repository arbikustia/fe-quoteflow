import type { ReactElement } from "react";

import type { MasterDataCardProps } from "./MasterDataCard.type";

/**
 * Render reusable mobile card for master-data lists.
 * @param {MasterDataCardProps} props - Card props
 * @returns {ReactElement} Master-data card
 */
export const MasterDataCard = ({ title, status, children, onClick, className = "", isLargeText = false }: MasterDataCardProps): ReactElement => {
  const statusClass = status === "active" ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong";
  const titleClassName = isLargeText ? "text-2xl" : "text-base";
  const contentClassName = isLargeText ? "text-xl" : "";
  const statusTextClassName = isLargeText ? "text-sm" : "text-xs";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-start gap-4 rounded-2xl border border-border-default bg-background-surface p-5 text-left transition-colors hover:border-border-strong hover:bg-background-subtle/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/30 ${className}`}
    >
      <span className="min-w-0 flex-1">
        <span className={`block truncate font-semibold text-text-primary ${titleClassName}`}>{title}</span>
        <span className={`mt-3 block ${contentClassName}`}>{children}</span>
      </span>
      {status && <span className={`shrink-0 rounded-full px-3 py-1 font-bold uppercase tracking-wider ${statusClass} ${statusTextClassName}`}>{status}</span>}
    </button>
  );
};
