import type * as React from "react";

export type SelectOption = {
  readonly label: string;
  readonly value: string;
};

export type SelectState = {
  readonly isOpen: boolean;
  readonly rootRef: React.RefObject<HTMLDivElement | null>;
  readonly toggleOpen: () => void;
  readonly getOptionHandler: (value: string) => () => void;
};

export type SelectProps = {
  readonly id: string;
  readonly label: string;
  readonly placeholder: string;
  readonly value: string;
  readonly options: readonly SelectOption[];
  readonly onChange: (value: string) => void;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly errorMessage?: string | null;
  readonly className?: string;
};
