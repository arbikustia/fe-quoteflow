import { useEffect, useRef, useState, type ReactElement } from "react";
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
 * Check if a date cell should be disabled.
 * @param {Dayjs} current - current cell date
 * @param {boolean} isEndDate - whether current field is end date
 * @param {Dayjs | null} startDayjs - start date dayjs instance
 * @param {DateRangePickerProps} pickerProps - parent picker props
 * @returns {boolean} disabled status
 */
const _isDisabledDate = (
  current: Dayjs,
  isEndDate: boolean,
  startDayjs: Dayjs | null,
  pickerProps: DateRangePickerProps,
): boolean => {
  if (pickerProps.disabledDate?.(current)) {
    return true;
  }

  if (isEndDate) {
    if (pickerProps.endDisabledDate?.(current)) {
      return true;
    }

    if (startDayjs && current.isBefore(startDayjs, "day")) {
      return true;
    }
  } else if (pickerProps.startDisabledDate?.(current)) {
    return true;
  }

  return false;
};

/**
 * Render field label.
 * @param {string} id - input id
 * @param {string} label - field label text
 * @returns {ReactElement} rendered label
 */
const _renderLabel = (id: string, label: string): ReactElement => {
  const labelParts = label.split(" *");

  return (
    <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-text-secondary">
      {labelParts[0]}
      {label.includes(" *") && <span aria-hidden="true" className="ml-1 text-danger">*</span>}
    </label>
  );
};

/**
 * Render field error message.
 * @param {boolean | undefined} error - error flag
 * @param {string | undefined} errorMessage - custom error message
 * @param {string} label - field label text
 * @returns {ReactElement | null} error element
 */
const _renderError = (
  error: boolean | undefined,
  errorMessage: string | undefined,
  label: string,
): ReactElement | null => {
  if (!error) {
    return null;
  }

  return (
    <p role="alert" className="mt-1.5 text-[13px] font-medium text-danger">
      {errorMessage ?? `${label.replace(" *", "")} is required`}
    </p>
  );
};

/**
 * Render date picker field.
 * @param {DateRangeFieldProps} fieldProps - date field props
 * @returns {ReactElement} date field
 */
const _renderDateField = (fieldProps: DateRangeFieldProps): ReactElement => {
  const { id, label, value, error, errorMessage, onChange, open, onOpenChange, pickerProps } = fieldProps;
  const isEndDate = id === "date-range-end";
  const startDayjs = _toDayjs(pickerProps.startDate);
  const minDate = isEndDate ? (startDayjs ?? _toDayjs(pickerProps.minDate)) : _toDayjs(pickerProps.minDate);
  const format = pickerProps.showTime ? "YYYY-MM-DD HH:mm" : DATE_FORMAT;

  /**
   * Format selected date value.
   * @param {Dayjs | null} date - selected date
   * @returns {void} no return value
   */
  const handleChange = (date: Dayjs | null): void =>
    onChange?.(date?.format(pickerProps.showTime ? DATE_TIME_FORMAT : DATE_FORMAT) ?? "");

  /**
   * Disable dates in date picker popup.
   * @param {Dayjs} current - current cell date
   * @returns {boolean} disabled status
   */
  const handleDisabledDate = (current: Dayjs): boolean =>
    _isDisabledDate(current, isEndDate, startDayjs, pickerProps);

  return (
    <div className="flex-1">
      {_renderLabel(id, label)}
      <DatePicker
        id={id}
        value={_toDayjs(value)}
        onChange={handleChange}
        disabled={pickerProps.disabled}
        disabledDate={handleDisabledDate}
        minDate={minDate ?? undefined}
        maxDate={_toDayjs(pickerProps.maxDate) ?? undefined}
        showTime={pickerProps.showTime}
        format={format}
        inputReadOnly
        placeholder="Select date"
        status={error ? "error" : undefined}
        open={open}
        onOpenChange={onOpenChange}
        placement="bottomLeft"
        className="h-14 w-full"
        classNames={{ popup: { root: "date-range-popup" } }}
      />
      {_renderError(error, errorMessage, label)}
    </div>
  );
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
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const touchStartY = useRef<number | null>(null);

  // Setup mobile swipe to dismiss and backdrop click
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent): void => {
      const target = e.target as HTMLElement;
      // If clicking directly on the popup backdrop
      if (target.classList.contains("date-range-popup")) {
        setOpenStart(false);
        setOpenEnd(false);
      }
    };

    const handleTouchStart = (e: TouchEvent): void => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent): void => {
      if (touchStartY.current === null) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchEndY - touchStartY.current;
      // Hanya tutup jika swipe ke bawah dilakukan dari area header/kosong (bukan scroll list jam/menit)
      const target = e.target as HTMLElement;
      const isScrollArea = target.closest(".ant-picker-time-panel-column");
      if (!isScrollArea && diffY > 60) {
        setOpenStart(false);
        setOpenEnd(false);
      }
      touchStartY.current = null;
    };

    document.addEventListener("click", handlePointerDown, true);
    document.addEventListener("touchstart", handleTouchStart, { passive: true, capture: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true, capture: true });

    return () => {
      document.removeEventListener("click", handlePointerDown, true);
      document.removeEventListener("touchstart", handleTouchStart, true);
      document.removeEventListener("touchend", handleTouchEnd, true);
    };
  }, []);

  return (
    <div className={`block ${props.className ?? ""}`}>
      {props.label && <span className="mb-1.5 block text-sm font-semibold text-text-secondary">{props.label}</span>}
      <div className="flex flex-col gap-4 sm:flex-row">
        {_renderRangeField({
          id: "date-range-start",
          label: startLabel,
          value: props.startDate,
          error: props.startError,
          errorMessage: props.startErrorMessage,
          onChange: props.onStartDateChange,
          open: openStart,
          onOpenChange: setOpenStart,
          pickerProps: props,
        })}
        {_renderRangeField({
          id: "date-range-end",
          label: endLabel,
          value: props.endDate,
          error: props.endError,
          errorMessage: props.endErrorMessage,
          onChange: props.onEndDateChange,
          open: openEnd,
          onOpenChange: setOpenEnd,
          pickerProps: props,
        })}
      </div>
    </div>
  );
};
