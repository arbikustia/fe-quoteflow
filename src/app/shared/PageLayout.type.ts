import type * as React from "react";

export type PageLayoutAction = {
  label: string;
  onClick: () => void;
  isDangerous?: boolean;
};

export type PageLayoutProps = {
  title: string;
  breadcrumbs?: string[];
  actions?: PageLayoutAction[];
  headerRight?: React.ReactNode;
  mobileHeaderClassName?: string;
  mobileTitleClassName?: string;
  onBack: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
};
