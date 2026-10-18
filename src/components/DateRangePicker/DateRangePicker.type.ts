import type { ChangeEventHandler, MouseEventHandler } from "react";

export type DateInputProps = {
  readonly ariaLabel: string;
  readonly value?: string;
  readonly onChange?: ChangeEventHandler<HTMLInputElement>;
  readonly onClick: MouseEventHandler<HTMLInputElement>;
  readonly min?: string;
  readonly max?: string;
  readonly disabled: boolean;
  readonly compact: boolean;
};

export type DateRangePickerVariant = "split" | "compact";

export type DateRangePickerProps = {
  readonly label?: string;
  readonly startLabel?: string;
  readonly endLabel?: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly onStartDateChange?: ChangeEventHandler<HTMLInputElement>;
  readonly onEndDateChange?: ChangeEventHandler<HTMLInputElement>;
  readonly minDate?: string;
  readonly maxDate?: string;
  readonly disabled?: boolean;
  readonly variant?: DateRangePickerVariant;
  readonly className?: string;
};
