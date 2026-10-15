import type { ChangeEventHandler } from "react";

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
