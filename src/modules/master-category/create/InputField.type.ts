import type { ChangeEvent, ReactNode } from "react";

export type InputFieldProps = {
  readonly label: string;
  readonly placeholder: string;
  readonly value: string;
  readonly required?: boolean;
  readonly icon: ReactNode;
  readonly multiline?: boolean;
  readonly onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};
