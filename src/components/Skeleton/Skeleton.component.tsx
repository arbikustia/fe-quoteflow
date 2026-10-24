import type { ReactElement } from "react";
import { Skeleton as AntSkeleton } from "antd";

import type { SkeletonProps } from "./Skeleton.type";

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
