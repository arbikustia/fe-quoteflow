import * as React from "react";
import { FiArrowRight, FiCalendar } from "react-icons/fi";

import type { DateRangePickerProps } from "./DateRangePicker.type";

/**
 * Reusable modern date range picker component.
 * @param {DateRangePickerProps} props - component props
 * @returns {React.ReactElement} date range picker
 */
export const DateRangePicker = ({
  label,
  startLabel = "Start date",
  endLabel = "End date",
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minDate,
  maxDate,
  disabled = false,
  variant = "split",
  className = "",
}: DateRangePickerProps): React.ReactElement => {
  /**
   * Open native picker on input click.
   * @param {React.MouseEvent<HTMLInputElement>} event - click event
   * @returns {void}
   */
  const handleInputClick = (event: React.MouseEvent<HTMLInputElement>): void => {
    try {
      event.currentTarget.showPicker?.();
    } catch {
      // Browser doesn't support showPicker
    }
  };

  if (variant === "compact") {
    return (
      <div className={`inline-flex flex-col ${className}`}>
        {label && <span className="mb-1 block text-sm font-medium text-text-primary">{label}</span>}
        <div className="inline-flex h-11 items-center gap-2 rounded-xl border border-border-default bg-background-surface px-3 shadow-sm transition-colors hover:border-border-strong focus-within:border-border-focus focus-within:ring-2 focus-within:ring-focus-ring/30">
          <FiCalendar aria-hidden="true" className="h-5 w-5 shrink-0 text-text-tertiary" />
          <input
            type="date"
            aria-label={startLabel}
            value={startDate}
            onChange={onStartDateChange}
            onClick={handleInputClick}
            min={minDate}
            max={endDate || maxDate}
            disabled={disabled}
            className="cursor-pointer bg-transparent text-sm font-medium text-text-primary outline-none disabled:cursor-not-allowed disabled:text-text-disabled"
          />
          <FiArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-text-tertiary" />
          <input
            type="date"
            aria-label={endLabel}
            value={endDate}
            onChange={onEndDateChange}
            onClick={handleInputClick}
            min={startDate || minDate}
            max={maxDate}
            disabled={disabled}
            className="cursor-pointer bg-transparent text-sm font-medium text-text-primary outline-none disabled:cursor-not-allowed disabled:text-text-disabled"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`block ${className}`}>
      {label && <span className="mb-1.5 block text-sm font-medium text-text-primary">{label}</span>}
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <FiCalendar
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-tertiary"
          />
          <input
            type="date"
            aria-label={startLabel}
            value={startDate}
            onChange={onStartDateChange}
            onClick={handleInputClick}
            min={minDate}
            max={endDate || maxDate}
            disabled={disabled}
            className="h-11 w-full cursor-pointer rounded-xl border border-border-default bg-background-surface pl-12 pr-4 text-sm font-medium text-text-primary shadow-sm outline-none transition-colors hover:border-border-strong focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30 disabled:cursor-not-allowed disabled:bg-background-disabled disabled:text-text-disabled"
          />
        </div>
        <span className="hidden items-center justify-center text-text-tertiary sm:flex" aria-hidden="true">
          <FiArrowRight className="h-4 w-4" />
        </span>
        <div className="relative flex-1">
          <FiCalendar
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-tertiary"
          />
          <input
            type="date"
            aria-label={endLabel}
            value={endDate}
            onChange={onEndDateChange}
            onClick={handleInputClick}
            min={startDate || minDate}
            max={maxDate}
            disabled={disabled}
            className="h-11 w-full cursor-pointer rounded-xl border border-border-default bg-background-surface pl-12 pr-4 text-sm font-medium text-text-primary shadow-sm outline-none transition-colors hover:border-border-strong focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30 disabled:cursor-not-allowed disabled:bg-background-disabled disabled:text-text-disabled"
          />
        </div>
      </div>
    </div>
  );
};
