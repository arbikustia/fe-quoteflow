import type { ChangeEvent } from "react";

export type InputFieldProps = {
  readonly label: string;
  readonly placeholder: string;
  readonly value: string;
  readonly required?: boolean;
  readonly onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};
