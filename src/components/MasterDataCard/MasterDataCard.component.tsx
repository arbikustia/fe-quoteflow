import type { ReactElement } from "react";

import type { MasterDataCardProps } from "./MasterDataCard.type";

/**
 * Render reusable mobile card for master-data lists.
 * @param {MasterDataCardProps} props - Card props
 * @returns {ReactElement} Master-data card
 */
export const MasterDataCard = ({ title, status, statusLabel, statusClassName, children, onClick, className = "", isLargeText = false }: MasterDataCardProps): ReactElement => {
  const statusClass = statusClassName ?? (status === "active" ? "bg-success-subtle text-success-strong" : "bg-danger-subtle text-danger-strong");
  const visibleStatus = statusLabel ?? status;
  const titleClassName = isLargeText ? "text-xl" : "text-base";
  const contentClassName = isLargeText ? "text-lg" : "";
  const statusTextClassName = isLargeText ? "text-lg" : "text-xs";

  return (
    <button
      type="button"
      disabled={!onClick}
      onClick={onClick}
      className={`group block w-full min-w-0 rounded-xl border border-border-strong bg-background-surface p-5 text-left shadow-small transition-colors hover:bg-background-subtle/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-primary ${className}`}
    >
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-2">
        <span className={`min-w-0 break-words font-semibold text-text-primary ${titleClassName}`}>{title}</span>
        {visibleStatus && <span className={`rounded-full px-3 py-1 font-semibold ${statusClass} ${statusTextClassName}`}>{visibleStatus}</span>}
      </span>
      <span className={`mt-4 block min-w-0 border-t border-border-default pt-4 text-text-secondary ${contentClassName}`}>{children}</span>
    </button>
  );
};
