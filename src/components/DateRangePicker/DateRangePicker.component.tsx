import * as React from "react";
import { FiArrowRight, FiCalendar } from "react-icons/fi";

import type { DateInputProps, DateRangePickerProps } from "./DateRangePicker.type";

/**
 * Render one date input.
 * @param {DateInputProps} props - input props
 * @returns {React.ReactElement} date input
 */
const _renderDateInput = (props: DateInputProps): React.ReactElement => {
  const { ariaLabel, value, onChange, onClick, min, max, disabled, compact } = props;
  const className = compact
    ? "cursor-pointer bg-transparent text-sm font-medium text-text-primary outline-none disabled:cursor-not-allowed disabled:text-text-disabled"
    : "h-11 w-full cursor-pointer rounded-xl border border-border-default bg-background-surface pl-12 pr-4 text-sm font-medium text-text-primary shadow-sm outline-none transition-colors hover:border-border-strong focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30 disabled:cursor-not-allowed disabled:bg-background-disabled disabled:text-text-disabled";

  return (
    <div className={compact ? "contents" : "relative flex-1"}>
      {!compact && <FiCalendar aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-tertiary" />}
      <input type="date" aria-label={ariaLabel} value={value} onChange={onChange} onClick={onClick} min={min} max={max} disabled={disabled} className={className} />
    </div>
  );
};

/**
 * Render compact date range.
 * @param {DateRangePickerProps} props - range props
 * @param {React.MouseEventHandler<HTMLInputElement>} handleInputClick - click handler
 * @returns {React.ReactElement} compact date range
 */
const _renderCompact = (props: DateRangePickerProps, handleInputClick: React.MouseEventHandler<HTMLInputElement>): React.ReactElement => (
  <div className={`inline-flex flex-col ${props.className ?? ""}`}>
    {props.label && <span className="mb-1 block text-sm font-medium text-text-primary">{props.label}</span>}
    <div className="inline-flex h-11 items-center gap-2 rounded-xl border border-border-default bg-background-surface px-3 shadow-sm transition-colors hover:border-border-strong focus-within:border-border-focus focus-within:ring-2 focus-within:ring-focus-ring/30">
      <FiCalendar aria-hidden="true" className="h-5 w-5 shrink-0 text-text-tertiary" />
      {_renderDateInput({ ariaLabel: props.startLabel ?? "Start date", value: props.startDate, onChange: props.onStartDateChange, onClick: handleInputClick, min: props.minDate, max: props.endDate || props.maxDate, disabled: props.disabled ?? false, compact: true })}
      <FiArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-text-tertiary" />
      {_renderDateInput({ ariaLabel: props.endLabel ?? "End date", value: props.endDate, onChange: props.onEndDateChange, onClick: handleInputClick, min: props.startDate || props.minDate, max: props.maxDate, disabled: props.disabled ?? false, compact: true })}
    </div>
  </div>
);

/**
 * Render split date range.
 * @param {DateRangePickerProps} props - range props
 * @param {React.MouseEventHandler<HTMLInputElement>} handleInputClick - click handler
 * @returns {React.ReactElement} split date range
 */
const _renderSplit = (props: DateRangePickerProps, handleInputClick: React.MouseEventHandler<HTMLInputElement>): React.ReactElement => (
  <div className={`block ${props.className ?? ""}`}>
    {props.label && <span className="mb-1.5 block text-sm font-medium text-text-primary">{props.label}</span>}
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
      {_renderDateInput({ ariaLabel: props.startLabel ?? "Start date", value: props.startDate, onChange: props.onStartDateChange, onClick: handleInputClick, min: props.minDate, max: props.endDate || props.maxDate, disabled: props.disabled ?? false, compact: false })}
      <span className="hidden items-center justify-center text-text-tertiary sm:flex" aria-hidden="true"><FiArrowRight className="h-4 w-4" /></span>
      {_renderDateInput({ ariaLabel: props.endLabel ?? "End date", value: props.endDate, onChange: props.onEndDateChange, onClick: handleInputClick, min: props.startDate || props.minDate, max: props.maxDate, disabled: props.disabled ?? false, compact: false })}
    </div>
  </div>
);

/**
 * Reusable modern date range picker component.
 * @param {DateRangePickerProps} props - component props
 * @returns {React.ReactElement} date range picker
 */
export const DateRangePicker = (props: DateRangePickerProps): React.ReactElement => {
  /**
   * Open native picker on input click.
   * @param {React.MouseEvent<HTMLInputElement>} event - click event
   * @returns {void}
   */
  const handleInputClick: React.MouseEventHandler<HTMLInputElement> = (event) => {
    try {
      event.currentTarget.showPicker?.();
    } catch {
      // Browser doesn't support showPicker.
    }
  };

  return props.variant === "compact" ? _renderCompact(props, handleInputClick) : _renderSplit(props, handleInputClick);
};
