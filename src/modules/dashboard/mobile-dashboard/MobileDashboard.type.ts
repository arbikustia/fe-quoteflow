import * as React from 'react';

export type StatusCardProps = {
  title: string;
  count: number;
  bgColor: string;
  iconColor: string;
  icon: React.ReactNode;
};

export type QuickActionsProps = {
  onAddOrder: () => void;
  onOrderReport: () => void;
};

export type MobileDashboardProps = QuickActionsProps & {
  statuses: StatusCardProps[];
};

export type MobileDashboardHookReturn = {
  handleAddOrder: () => void;
  handleOrderReport: () => void;
};
