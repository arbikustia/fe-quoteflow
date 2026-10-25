import type { ReactNode } from "react";

export type CheckboxProps = {
  id?: string;
  label?: ReactNode;
  ariaLabel?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  className?: string;
};
