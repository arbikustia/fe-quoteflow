import type { ReactElement } from "react";
import { DatePicker as AntDatePicker } from "antd";
import dayjs, { type Dayjs } from "dayjs";

import type { DatePickerProps } from "./DatePicker.type";

const DATE_FORMAT = "YYYY-MM-DD";

/**
 * Convert date string to Dayjs.
 * @param {string | undefined} value - date value
 * @returns {Dayjs | null} parsed date
 */
const _toDayjs = (value: string | undefined): Dayjs | null => {
  if (!value) return null;

  const date = dayjs(value);

  return date.isValid() ? date : null;
};

/**
 * Render reusable Ant Design date picker.
 * @param {DatePickerProps} props - date picker props
 * @returns {ReactElement} date picker
 */
export const DatePicker = (props: DatePickerProps): ReactElement => {
  const { id, label, value, onChange, required, disabled, className = "", popupClassName = "", errorMessage } = props;
  const errorId = id ? `${id}-error` : undefined;

  /**
   * Update selected date.
   * @param {Dayjs | null} date - selected date
   * @returns {void} no return value
   */
  const handleChange = (date: Dayjs | null): void => onChange?.(date?.format(DATE_FORMAT) ?? "");

  return (
    <div className={`block ${className}`}>
      {label && <label htmlFor={id} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">{label}{required && <span aria-hidden="true" className="ml-1 text-danger">*</span>}</label>}
      <AntDatePicker
        id={id}
        value={_toDayjs(value)}
        onChange={handleChange}
        disabled={disabled}
        format={DATE_FORMAT}
        inputReadOnly
        placeholder="Select date"
        aria-invalid={Boolean(errorMessage)}
        aria-describedby={errorMessage ? errorId : undefined}
        status={errorMessage ? "error" : undefined}
        placement="topLeft"
        className="h-14 w-full"
        classNames={{ popup: { root: popupClassName } }}
      />
      {errorMessage && <p id={errorId} role="alert" className="mt-1.5 text-sm text-danger">{errorMessage}</p>}
    </div>
  );
};
