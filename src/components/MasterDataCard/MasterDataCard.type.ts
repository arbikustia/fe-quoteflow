import type { ReactNode } from "react";

export type MasterDataCardProps = {
  title: string;
  status?: "active" | "inactive";
  statusLabel?: string;
  statusClassName?: string;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  isLargeText?: boolean;
};
