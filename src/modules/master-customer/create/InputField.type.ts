import type { ChangeEvent } from "react";

export type InputFieldProps = {
  readonly label: string;
  readonly placeholder: string;
  readonly value: string;
  readonly required?: boolean;
  readonly type?: string;
  readonly pattern?: string;
  readonly inputMode?: "text" | "tel" | "numeric" | "email" | "url";
  readonly title?: string;
  readonly multiline?: boolean;
  readonly onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};
