import type { ReactNode } from "react";

export type TabItem = {
  readonly id: string;
  readonly label: string;
  readonly count?: number;
  readonly icon?: ReactNode;
};

export type TabsProps = {
  readonly items: readonly TabItem[];
  readonly activeId: string;
  readonly onChange: (id: string) => void;
};
