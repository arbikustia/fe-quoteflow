import type { ChangeEvent } from "react";

type InputBaseProps = {
  readonly id: string;
  readonly label: string;
  readonly placeholder?: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
  readonly className?: string;
  readonly errorMessage?: string | null;
};

export type TextInputProps = InputBaseProps & {
  readonly type?: "text" | "tel" | "email" | "password" | "url" | "search";
  readonly value: string;
  readonly inputMode?: "text" | "tel" | "numeric" | "email" | "url";
  readonly pattern?: string;
  readonly title?: string;
  readonly onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export type NumberInputProps = InputBaseProps & {
  readonly type: "number";
  readonly value: number | null;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly onChange: (value: number | null) => void;
};

export type TextAreaInputProps = InputBaseProps & {
  readonly type: "textarea";
  readonly value: string;
  readonly rows?: number;
  readonly onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
};

export type InputOption = {
  readonly label: string;
  readonly value: string;
};

export type SelectInputProps = InputBaseProps & {
  readonly type: "select";
  readonly value: string;
  readonly options: readonly InputOption[];
  readonly onChange: (value: string) => void;
};

export type InputComponentProps = TextInputProps | NumberInputProps | TextAreaInputProps | SelectInputProps;
