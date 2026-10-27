export type DateRangePickerVariant = "split" | "compact";

export type DateRangePickerProps = {
  label?: string;
  startLabel?: string;
  endLabel?: string;
  startDate?: string;
  endDate?: string;
  onStartDateChange?: (value: string) => void;
  onEndDateChange?: (value: string) => void;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
  variant?: DateRangePickerVariant;
  className?: string;
  showTime?: boolean;
  startError?: boolean;
  endError?: boolean;
};

export type DateRangeFieldProps = {
  id: string;
  label: string;
  value?: string;
  error?: boolean;
  onChange?: (value: string) => void;
  pickerProps: DateRangePickerProps;
};

export type DateRangePickerState = {
  activeField: "start" | "end" | null;
  visibleMonth: Date;
  setActiveField: (field: "start" | "end" | null) => void;
  setVisibleMonth: (date: Date) => void;
};
