import type * as React from "react";

export type BottomNavItem = {
  readonly label: string;
  readonly path: string;
  readonly icon: React.ReactElement;
};
