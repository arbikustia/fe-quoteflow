export type DateRangePickerVariant = "split" | "compact";

export type DateRangePickerProps = {
  readonly label?: string;
  readonly startLabel?: string;
  readonly endLabel?: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly onStartDateChange?: (value: string) => void;
  readonly onEndDateChange?: (value: string) => void;
  readonly minDate?: string;
  readonly maxDate?: string;
  readonly disabled?: boolean;
  readonly variant?: DateRangePickerVariant;
  readonly className?: string;
  readonly showTime?: boolean;
};

export type DateRangePickerState = {
  readonly activeField: "start" | "end" | null;
  readonly visibleMonth: Date;
  readonly setActiveField: (field: "start" | "end" | null) => void;
  readonly setVisibleMonth: (date: Date) => void;
};
