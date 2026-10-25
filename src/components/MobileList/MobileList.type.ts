import type * as React from "react";

export type MobileListItemProps = {
  title: string;
  subtitle?: string;
  meta?: string;
  imageUrl?: string;
  fallbackInitial?: string;
  hideImage?: boolean;
  badge?: React.ReactNode;
  hideEdit?: boolean;
  titleClassName?: string;
  metaClassName?: string;
  subtitleClassName?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
};

export type MobileListProps = {
  data: MobileListItemProps[];
  emptyText?: string;
};
