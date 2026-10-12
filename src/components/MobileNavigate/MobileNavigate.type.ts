import type * as React from "react";

export type MobileNavigateItem = {
  readonly id: string;
  readonly label: string;
  readonly Icon: () => React.ReactElement;
};

export type MobileNavigateResolvedItem = MobileNavigateItem & {
  readonly isActive: boolean;
};

export type MobileNavigateProps = {
  readonly items: readonly MobileNavigateResolvedItem[];
  readonly onNavigate: (path: string) => void;
  readonly isHidden: boolean;
};

export type MobileNavigateHookResult = {
  readonly getItems: (items: readonly MobileNavigateItem[]) => readonly MobileNavigateResolvedItem[];
};
