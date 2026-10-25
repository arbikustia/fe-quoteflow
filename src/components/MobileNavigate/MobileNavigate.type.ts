import type * as React from "react";

export type MobileNavigateItem = {
  id: string;
  label: string;
  Icon: () => React.ReactElement;
};

export type MobileNavigateResolvedItem = MobileNavigateItem & {
  isActive: boolean;
};

export type MobileNavigateProps = {
  items: MobileNavigateResolvedItem[];
  onNavigate: (path: string) => void;
  isHidden: boolean;
};

export type MobileNavigateHookResult = {
  getItems: (items: MobileNavigateItem[]) => MobileNavigateResolvedItem[];
};
