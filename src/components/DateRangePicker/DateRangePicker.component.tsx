import * as React from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

import type { DateRangePickerProps } from "./DateRangePicker.type";

const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const _toInputValue = (date: Date, showTime: boolean): string => {
  const timezoneOffset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, showTime ? 16 : 10);
};

const _toDate = (value?: string): Date | null => {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

const _isSameDay = (first: Date, second: Date | null): boolean => Boolean(second && first.toDateString() === second.toDateString());

const _isDisabled = (date: Date, minDate?: string, maxDate?: string): boolean => {
  const dateValue = _toInputValue(date, false);

  return Boolean((minDate && dateValue < minDate.slice(0, 10)) || (maxDate && dateValue > maxDate.slice(0, 10)));
};

const _getMonthDays = (month: Date): Date[] => {
  const firstDate = new Date(month.getFullYear(), month.getMonth(), 1);
  const firstGridDate = new Date(month.getFullYear(), month.getMonth(), 1 - firstDate.getDay());

  return Array.from({ length: 42 }, (_value, index) => new Date(firstGridDate.getFullYear(), firstGridDate.getMonth(), firstGridDate.getDate() + index));
};

const _formatValue = (value: string | undefined, showTime: boolean): string => {
  const date = _toDate(value);

  if (!date) return "Select date";

  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", ...(showTime ? { hour: "2-digit", minute: "2-digit", hour12: false } : {}) }).format(date);
};

const _renderCalendar = (props: DateRangePickerProps, activeField: "start" | "end", visibleMonth: Date, onVisibleMonthChange: (date: Date) => void, onSelect: (value: string, shouldClose: boolean) => void): React.ReactElement => {
  const selectedDate = _toDate(activeField === "start" ? props.startDate : props.endDate);
  const monthDays = _getMonthDays(visibleMonth);
  const selectDate = (date: Date): void => {
    if (_isDisabled(date, props.minDate, props.maxDate)) return;

    const currentDate = selectedDate ?? date;
    const nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), currentDate.getHours(), currentDate.getMinutes());

    onSelect(_toInputValue(nextDate, props.showTime ?? false), !props.showTime);
  };

  return <div className="absolute z-30 mt-2 w-[20rem] rounded-2xl border border-border-default bg-background-surface p-4 shadow-lg"><div className="mb-4 flex items-center justify-between"><button aria-label="Previous month" type="button" onClick={() => onVisibleMonthChange(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))} className="rounded-lg p-2 text-text-secondary hover:bg-background-page hover:text-text-primary"><FiChevronLeft /></button><span className="text-sm font-semibold text-text-primary">{visibleMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span><button aria-label="Next month" type="button" onClick={() => onVisibleMonthChange(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))} className="rounded-lg p-2 text-text-secondary hover:bg-background-page hover:text-text-primary"><FiChevronRight /></button></div><div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-text-tertiary">{WEEK_DAYS.map((day) => <span key={day} className="py-1">{day}</span>)}</div><div className="mt-1 grid grid-cols-7 gap-1">{monthDays.map((date) => { const isSelected = _isSameDay(date, selectedDate); const isDisabled = _isDisabled(date, props.minDate, props.maxDate); const isCurrentMonth = date.getMonth() === visibleMonth.getMonth(); return <button key={date.toISOString()} disabled={isDisabled} type="button" onClick={() => selectDate(date)} className={`h-9 rounded-lg text-sm transition-colors ${isSelected ? "bg-action-primary font-semibold text-text-inverse" : "text-text-primary hover:bg-background-page"} ${!isCurrentMonth ? "text-text-tertiary" : ""} disabled:cursor-not-allowed disabled:opacity-30`}>{date.getDate()}</button>; })}</div>{props.showTime && <label className="mt-4 block border-t border-border-default pt-4 text-sm font-medium text-text-primary">Time<input aria-label={`${activeField === "start" ? "Start" : "End"} time`} type="time" value={selectedDate ? _toInputValue(selectedDate, true).slice(11) : ""} onClick={(event) => { try { event.currentTarget.showPicker?.(); } catch { /* Browser may not support showPicker. */ } }} onChange={(event) => { const currentDate = selectedDate ?? new Date(); const [hours, minutes] = event.target.value.split(":").map(Number); currentDate.setHours(hours, minutes); onSelect(_toInputValue(currentDate, true), true); }} className="mt-1.5 h-10 w-full cursor-pointer rounded-xl border border-border-default bg-background-surface px-3 text-text-primary outline-none transition-colors hover:border-border-strong focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30" /></label>}</div>;
};

/**
 * Render custom date range picker.
 * @param {DateRangePickerProps} props - component props
 * @returns {React.ReactElement} date range picker
 */
export const DateRangePicker = (props: DateRangePickerProps): React.ReactElement => {
  const [activeField, setActiveField] = React.useState<"start" | "end" | null>(null);
  const [visibleMonth, setVisibleMonth] = React.useState<Date>(_toDate(props.startDate) ?? new Date());
  const showTime = props.showTime ?? false;
  const isCompact = props.variant === "compact";
  const selectValue = (field: "start" | "end", value: string): void => {
    if (field === "start") props.onStartDateChange?.(value);
    else props.onEndDateChange?.(value);
  };
  const renderField = (field: "start" | "end"): React.ReactElement => {
    const isStart = field === "start";
    const label = isStart ? props.startLabel ?? "Start Date" : props.endLabel ?? "End Date";
    const value = isStart ? props.startDate : props.endDate;
    const isOpen = activeField === field;
    const handleClick = (): void => { const date = _toDate(value); if (date) setVisibleMonth(date); setActiveField(isOpen ? null : field); };

    return <div className={`relative ${isCompact ? "flex-1" : "flex-1"}`}><span className={isCompact ? "sr-only" : "mb-1.5 block text-sm font-medium text-text-primary"}>{label}</span><button aria-expanded={isOpen} aria-haspopup="dialog" disabled={props.disabled} type="button" onClick={handleClick} className={`flex h-[46px] w-full items-center gap-3 rounded-xl border border-border-default bg-background-surface px-4 text-left text-sm font-medium text-text-primary outline-none transition-colors hover:border-border-strong focus:border-border-focus focus:ring-2 focus:ring-focus-ring/30 disabled:cursor-not-allowed disabled:bg-background-disabled ${isCompact ? "border-0 bg-transparent px-0" : ""}`}><FiCalendar aria-hidden="true" className="h-5 w-5 shrink-0 text-text-tertiary" /><span>{_formatValue(value, showTime)}</span></button>{isOpen && _renderCalendar(props, field, visibleMonth, setVisibleMonth, (nextValue, shouldClose) => { selectValue(field, nextValue); if (shouldClose) setActiveField(null); })}</div>;
  };

  return <div className={`${isCompact ? "inline-flex flex-col" : "block"} ${props.className ?? ""}`}>{props.label && <span className="mb-1.5 block text-sm font-medium text-text-primary">{props.label}</span>}<div className={`flex items-stretch gap-2 ${isCompact ? "rounded-xl border border-border-default bg-background-surface px-3" : "flex-col sm:flex-row"}`}>{renderField("start")}{renderField("end")}</div></div>;
};
