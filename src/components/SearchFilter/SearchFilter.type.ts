import type { ChangeEventHandler } from "react";

export type SearchFilterProps = {
  readonly placeholder: string;
  readonly onChange?: ChangeEventHandler<HTMLInputElement>;
  readonly className?: string;
  readonly inputClassName?: string;
  readonly isRoundedFull?: boolean;
  readonly value?: string;
};
