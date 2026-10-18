import * as React from "react";
import { FiCalendar } from "react-icons/fi";

import type { DatePickerProps } from "./DatePicker.type";

/**
 * Reusable date picker component.
 * @param {DatePickerProps} props - component props
 * @returns {React.ReactElement} date picker
 */
export const DatePicker = ({
  label,
  className = "",
  ...inputProps
}: DatePickerProps): React.ReactElement => {
  /**
   * Handle input click to open native picker directly.
   * @param {React.MouseEvent<HTMLInputElement>} event - mouse event
   * @returns {void}
   */
  const handleClick = (event: React.MouseEvent<HTMLInputElement>): void => {
    try {
      event.currentTarget.showPicker?.();
    } catch {
      // Browser doesn't support or disallows showPicker
    }

    inputProps.onClick?.(event);
  };

  return (
    <label className={`block ${className}`}>
      {label && <span className="block text-sm font-medium text-text-primary mb-1">{label}</span>}
      <div className="relative">
        <FiCalendar
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-tertiary"
        />
        <input
          type="date"
          {...inputProps}
          onClick={handleClick}
          className="h-11 w-full rounded-xl border border-border-default bg-background-surface pl-12 pr-4 text-base font-medium text-text-primary shadow-sm outline-none transition-colors placeholder:text-text-tertiary hover:border-border-strong focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30 cursor-pointer"
        />
      </div>
    </label>
  );
};
