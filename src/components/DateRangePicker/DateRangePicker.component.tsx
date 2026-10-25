import type { ReactElement } from "react";
import { DatePicker } from "antd";
import dayjs, { type Dayjs } from "dayjs";

import type { DateRangePickerProps } from "./DateRangePicker.type";

const DATE_FORMAT = "YYYY-MM-DD";
const DATE_TIME_FORMAT = "YYYY-MM-DDTHH:mm";

const _toDayjs = (value: string | undefined): Dayjs | null => {
  if (!value) return null;

  const date = dayjs(value);

  return date.isValid() ? date : null;
};

const _renderDateField = (id: string, label: string, value: string | undefined, error: boolean | undefined, onChange: ((value: string) => void) | undefined, props: DateRangePickerProps): ReactElement => {
  const format = props.showTime ? DATE_TIME_FORMAT : DATE_FORMAT;
  const handleChange = (date: Dayjs | null): void => onChange?.(date?.format(format) ?? "");

  const labelParts = label.split(" *");

  return <div className="flex-1"><label htmlFor={id} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">{labelParts[0]}{label.includes(" *") && <span aria-hidden="true" className="ml-1 text-danger">*</span>}</label><DatePicker id={id} value={_toDayjs(value)} onChange={handleChange} disabled={props.disabled} minDate={_toDayjs(props.minDate) ?? undefined} maxDate={_toDayjs(props.maxDate) ?? undefined} showTime={props.showTime} format={format} inputReadOnly placeholder="Select date" status={error ? "error" : undefined} placement={id === "date-range-start" ? "topLeft" : "bottomLeft"} className="h-14 w-full" classNames={{ popup: { root: "origin-top-left scale-75 text-[11px]" } }} /></div>;
};

export const DateRangePicker = (props: DateRangePickerProps): ReactElement => {
  const startLabel = props.startLabel ?? "Start Date";
  const endLabel = props.endLabel ?? "End Date";

  return <div className={`block ${props.className ?? ""}`}>{props.label && <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text-secondary">{props.label}</span>}<div className="flex flex-col gap-4 sm:flex-row">{_renderDateField("date-range-start", startLabel, props.startDate, props.startError, props.onStartDateChange, props)}{_renderDateField("date-range-end", endLabel, props.endDate, props.endError, props.onEndDateChange, props)}</div></div>;
};
