import type { ReactElement } from "react";
import { Skeleton as AntSkeleton } from "antd";

import type { CardSkeletonProps, SkeletonProps } from "./Skeleton.type";

/**
 * Render reusable card loading skeleton for mobile lists.
 * @param {CardSkeletonProps} props - Card skeleton props
 * @returns {ReactElement} Skeleton card list
 */
export const CardSkeletonComponent = ({ count = 5, className = "" }: CardSkeletonProps): ReactElement => (
  <div className={`space-y-3 ${className}`} aria-label="Loading cards" role="status">
    {Array.from({ length: count }, (_, index) => (
      <div key={`card-skeleton-${index}`} className="animate-pulse rounded-2xl border border-border-default bg-background-surface p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="h-6 w-2/5 rounded bg-background-subtle" />
          <div className="h-5 w-16 rounded-full bg-background-subtle" />
        </div>
        <div className="mt-3 grid gap-2">
          <div className="h-4 w-3/5 rounded bg-background-subtle" />
          <div className="h-4 w-4/5 rounded bg-background-subtle" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Render reusable Ant Design loading skeleton.
 * @param {SkeletonProps} props - Skeleton layout props
 * @returns {ReactElement} Skeleton layout
 */
export const SkeletonComponent = ({ rows = 5, columns = [{}, {}, {}], className = "" }: SkeletonProps): ReactElement => (
  <div className={`w-full overflow-hidden ${className}`} aria-label="Loading" role="status">
    <div className="flex h-12 items-center gap-4 border-b border-border-default bg-background-subtle px-4">
      {columns.map((column, index) => <AntSkeleton.Input key={`header-${index}`} active size="small" style={{ width: column.width ?? "100%" }} />)}
    </div>
    {Array.from({ length: rows }, (_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="flex h-14 items-center gap-4 border-b border-border-default px-4">
        {columns.map((column, columnIndex) => <AntSkeleton.Input key={`cell-${rowIndex}-${columnIndex}`} active size="small" style={{ width: column.width ?? "100%" }} />)}
      </div>
    ))}
  </div>
);

export default SkeletonComponent;
