import type { ReactNode } from "react";

export type DrawerPlacement = "top" | "right" | "bottom" | "left";

export type DrawerProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  placement?: DrawerPlacement;
  height?: string | number;
  width?: string | number;
};
