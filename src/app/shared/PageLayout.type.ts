import type * as React from "react";

export type PageLayoutAction = {
  readonly label: string;
  readonly onClick: () => void;
  readonly isDangerous?: boolean;
};

export type PageLayoutProps = {
  readonly title: string;
  readonly breadcrumbs?: string[];
  readonly actions?: PageLayoutAction[];
  readonly onBack: () => void;
  readonly children: React.ReactNode;
  readonly footer?: React.ReactNode;
};
