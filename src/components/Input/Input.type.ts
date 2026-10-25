import type { ChangeEvent } from "react";

type InputBaseProps = {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  errorMessage?: string | null;
};

export type TextInputProps = InputBaseProps & {
  type?: "text" | "tel" | "email" | "password" | "url" | "search";
  value: string;
  inputMode?: "text" | "tel" | "numeric" | "email" | "url";
  pattern?: string;
  title?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export type NumberInputProps = InputBaseProps & {
  type: "number";
  value: number | null;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number | null) => void;
};

export type TextAreaInputProps = InputBaseProps & {
  type: "textarea";
  value: string;
  rows?: number;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
};

export type InputOption = {
  label: string;
  value: string;
};

export type SelectInputProps = InputBaseProps & {
  type: "select";
  value: string;
  options: InputOption[];
  onChange: (value: string) => void;
};

export type InputComponentProps = TextInputProps | NumberInputProps | TextAreaInputProps | SelectInputProps;
