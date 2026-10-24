export type SkeletonColumn = {
  readonly width?: string;
};

export type SkeletonProps = {
  readonly rows?: number;
  readonly columns?: readonly SkeletonColumn[];
  readonly className?: string;
};
