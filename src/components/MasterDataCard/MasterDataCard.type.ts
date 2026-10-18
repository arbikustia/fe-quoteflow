import type { ReactNode } from "react";

export type MasterDataCardProps = {
  readonly title: string;
  readonly status?: "active" | "inactive";
  readonly children: ReactNode;
  readonly onClick: () => void;
  readonly className?: string;
};
