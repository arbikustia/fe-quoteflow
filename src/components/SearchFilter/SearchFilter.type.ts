import type { ChangeEventHandler } from "react";

export type SearchFilterProps = {
  placeholder: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  className?: string;
  inputClassName?: string;
  isRoundedFull?: boolean;
  value?: string;
};
