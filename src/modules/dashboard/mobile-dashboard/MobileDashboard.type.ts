import * as React from 'react';

export type StatusCardProps = {
  readonly title: string;
  readonly count: number;
  readonly bgColor: string;
  readonly iconColor: string;
  readonly icon: React.ReactNode;
};

export type QuickActionsProps = {
  readonly onAddOrder: () => void;
  readonly onOrderReport: () => void;
};

export type MobileDashboardProps = QuickActionsProps & {
  readonly statuses: StatusCardProps[];
};

export type MobileDashboardHookReturn = {
  readonly handleAddOrder: () => void;
  readonly handleOrderReport: () => void;
};
