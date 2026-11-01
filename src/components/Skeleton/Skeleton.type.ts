export type SkeletonColumn = {
  width?: string;
};

export type SkeletonProps = {
  rows?: number;
  columns?: SkeletonColumn[];
  className?: string;
};

export type CardSkeletonProps = {
  count?: number;
  className?: string;
};
