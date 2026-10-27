import type { ReactElement } from "react";
import { DatePicker } from "antd";
import dayjs, { type Dayjs } from "dayjs";

import type { DateRangeFieldProps, DateRangePickerProps } from "./DateRangePicker.type";

const DATE_FORMAT = "YYYY-MM-DD";
const DATE_TIME_FORMAT = "YYYY-MM-DDTHH:mm";

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
 * Render date picker field.
 * @param {DateRangeFieldProps} fieldProps - date field props
 * @returns {ReactElement} date field
 */
const _renderDateField = (fieldProps: DateRangeFieldProps): ReactElement => {
  const { id, label, value, error, onChange, pickerProps } = fieldProps;
  const format = pickerProps.showTime ? "YYYY-MM-DD HH:mm" : DATE_FORMAT;
  /**
   * Format selected date value.
   * @param {Dayjs | null} date - selected date
   * @returns {void} no return value
   */
  const handleChange = (date: Dayjs | null): void => onChange?.(date?.format(pickerProps.showTime ? DATE_TIME_FORMAT : DATE_FORMAT) ?? "");

  const labelParts = label.split(" *");

  return <div className="flex-1"><label htmlFor={id} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">{labelParts[0]}{label.includes(" *") && <span aria-hidden="true" className="ml-1 text-danger">*</span>}</label><DatePicker id={id} value={_toDayjs(value)} onChange={handleChange} disabled={pickerProps.disabled} minDate={_toDayjs(pickerProps.minDate) ?? undefined} maxDate={_toDayjs(pickerProps.maxDate) ?? undefined} showTime={pickerProps.showTime} format={format} inputReadOnly placeholder="Select date" status={error ? "error" : undefined} placement="topLeft" className="h-14 w-full" classNames={{ popup: { root: "text-[11px]" } }} />{error && <p role="alert" className="mt-1.5 text-[13px] font-medium text-danger">{labelParts[0]} is required</p>}</div>;
};

/**
 * Render date range field.
 * @param {DateRangeFieldProps} fieldProps - date field props
 * @returns {ReactElement} date range field
 */
const _renderRangeField = (fieldProps: DateRangeFieldProps): ReactElement => _renderDateField(fieldProps);

/**
 * Render date range picker.
 * @param {DateRangePickerProps} props - picker props
 * @returns {ReactElement} date range picker
 */
export const DateRangePicker = (props: DateRangePickerProps): ReactElement => {
  const startLabel = props.startLabel ?? "Start Date";
  const endLabel = props.endLabel ?? "End Date";

  return <div className={`block ${props.className ?? ""}`}>{props.label && <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">{props.label}</span>}<div className="flex flex-col gap-4 sm:flex-row">{_renderRangeField({ id: "date-range-start", label: startLabel, value: props.startDate, error: props.startError, onChange: props.onStartDateChange, pickerProps: props })}{_renderRangeField({ id: "date-range-end", label: endLabel, value: props.endDate, error: props.endError, onChange: props.onEndDateChange, pickerProps: props })}</div></div>;
};
