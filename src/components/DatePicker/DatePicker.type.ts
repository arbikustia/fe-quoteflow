import type { InputHTMLAttributes } from "react";

export type DatePickerProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "type"> & {
  label?: string;
  className?: string;
};
