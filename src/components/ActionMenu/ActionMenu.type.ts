import type { ReactNode, RefObject } from "react";

export type ActionMenuProps = {
  children: ReactNode;
  icon: ReactNode;
  testId: string;
};

export type ActionMenuState = {
  rootRef: RefObject<HTMLDetailsElement | null>;
};
