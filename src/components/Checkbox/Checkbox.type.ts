import type { ReactNode } from "react";

export type CheckboxProps = {
  readonly id?: string;
  readonly label?: ReactNode;
  readonly ariaLabel?: string;
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  readonly disabled?: boolean;
  readonly indeterminate?: boolean;
  readonly className?: string;
};
