import type * as React from "react";

export type MobileListItemProps = {
  readonly title: string;
  readonly subtitle?: string;
  readonly meta?: string;
  readonly imageUrl?: string;
  readonly fallbackInitial?: string;
  readonly hideImage?: boolean;
  readonly badge?: React.ReactNode;
  readonly hideEdit?: boolean;
  readonly titleClassName?: string;
  readonly metaClassName?: string;
  readonly subtitleClassName?: string;
  readonly onEdit?: () => void;
  readonly onDelete?: () => void;
  readonly onClick?: () => void;
};

export type MobileListProps = {
  readonly data: MobileListItemProps[];
  readonly emptyText?: string;
};
