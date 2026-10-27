export type DatePickerProps = {
  id?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  popupClassName?: string;
  errorMessage?: string | null;
};
