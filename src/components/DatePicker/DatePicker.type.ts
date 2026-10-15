import type { InputHTMLAttributes } from "react";

export type DatePickerProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "type"> & {
  readonly label?: string;
  readonly className?: string;
};
