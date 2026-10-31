import type { ReactElement } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

import { buildCalendarDays, buildCalendarWeekEventSegments, formatCalendarMonth, formatCalendarMonthShort } from "./Calendar.helpers";
import type { CalendarComponentProps, CalendarDayCell, CalendarEventItem, CalendarEventVariantClasses } from "./Calendar.type";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const EVENT_VARIANTS: CalendarEventVariantClasses = {
  neutral: "border-border-default bg-background-surface text-text-primary",
  blue: "border-primary-200 bg-primary-50 text-primary-700",
  pink: "border-pink-200 bg-pink-50 text-pink-700",
  green: "border-green-200 bg-green-50 text-green-700",
  purple: "border-primary-200 bg-primary-50 text-primary-700",
  orange: "border-orange-200 bg-orange-50 text-orange-700",
};

/**
 * Render one calendar event row.
 * @param {CalendarEventItem} event - Event item
 * @param {((event: CalendarEventItem) => void) | undefined} onEventClick - Click callback
 * @returns {ReactElement} Event pill button
 */
const _renderEvent = (event: CalendarEventItem, onEventClick: ((event: CalendarEventItem) => void) | undefined): ReactElement => (
  <button type="button" key={event.id} onClick={(): void => onEventClick?.(event)} className={`flex min-w-0 w-full items-center gap-1 rounded-md border px-2 py-1.5 text-left text-base font-semibold leading-5 transition-opacity hover:opacity-75 ${EVENT_VARIANTS[event.variant ?? "neutral"]}`} title={event.title}>
    <span className="min-w-0 flex-1 truncate">{event.title}</span>
    {event.time && <span className="shrink-0 text-sm font-medium opacity-75">{event.time}</span>}
  </button>
);

/**
 * Return badge class name for day number.
 * @param {CalendarDayCell} day - Day item
 * @returns {string} CSS class
 */
const _getDayNumberClassName = (day: CalendarDayCell): string => {
  if (day.isToday) {
    return "bg-action-primary text-text-inverse";
  }

  if (day.isCurrentMonth) {
    return "text-text-primary";
  }

  return "text-text-disabled opacity-40";
};

/**
 * Render one week with continuous multi-day event bars.
 * @param {CalendarDayCell[]} weekDays - Week cells
 * @param {((event: CalendarEventItem) => void) | undefined} onEventClick - Event callback
 * @returns {ReactElement} Week row
 */
const _renderWeek = (weekDays: CalendarDayCell[], onEventClick: ((event: CalendarEventItem) => void) | undefined): ReactElement => {
  const segments = buildCalendarWeekEventSegments(weekDays);

  return <div className="relative grid grid-cols-7 border-b border-border-default">{weekDays.map((day) => <div key={day.dateKey} aria-disabled={!day.isCurrentMonth} className={`relative aspect-square min-w-0 border-r border-border-default p-2 ${day.isCurrentMonth ? "" : "pointer-events-none bg-background-subtle"}`}><span className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs font-semibold ${_getDayNumberClassName(day)}`}>{day.dayNumber}</span>{day.isCurrentMonth && <div className="mt-2 space-y-2">{day.events.filter((event) => !event.endDate || event.endDate === event.date).slice(0, 5).map((event) => _renderEvent(event, onEventClick))}{day.events.length > 5 && <span className="block px-1 text-xs font-semibold text-text-secondary">{day.events.length - 5} more...</span>}</div>}</div>)}{segments.map((segment) => <div key={`${segment.event.id}-${segment.startColumn}`} className="absolute z-10" style={{ left: `calc(${segment.startColumn * 100 / 7}% + 0.5rem)`, width: `calc(${segment.span * 100 / 7}% - 1rem)`, top: `${2.25 + segment.row * 2.5}rem` }}>{_renderEvent(segment.event, onEventClick)}</div>)}</div>;
};

/**
 * Render reusable month calendar.
 * @param {CalendarComponentProps} props - Calendar properties
 * @returns {ReactElement} Calendar element
 */
export const CalendarComponent = (props: CalendarComponentProps): ReactElement => {
  const currentDate = props.currentDate ?? new Date();
  const today = new Date();
  const days = buildCalendarDays(currentDate, props.events);
  const monthLabel = formatCalendarMonth(currentDate);
  const visibleEvents = days.flatMap((day) => day.events).filter((event, index, events) => events.findIndex((candidate) => candidate.id === event.id) === index);

  return (
    <section className={`overflow-hidden rounded-xl border border-border-default bg-background-surface ${props.className ?? ""}`} aria-label={`${monthLabel} calendar`}>
      <header className="flex min-h-24 flex-wrap items-center justify-between gap-5 border-b border-border-default px-5 py-4 lg:px-7">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg border border-border-default bg-background-surface p-2"><span className="text-xs font-semibold text-text-tertiary">{formatCalendarMonthShort(today)}</span><span className="text-xl font-bold text-action-primary">{today.getDate()}</span></div>
          <div><div className="flex items-center gap-3"><h1 className="text-xl font-bold text-text-primary lg:text-2xl">{monthLabel}</h1><span className="rounded-md border border-border-default px-2 py-1 text-xs font-medium text-text-tertiary">Week {Math.ceil(currentDate.getDate() / 7)}</span></div><p className="mt-1.5 text-sm text-text-secondary">{new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} – {new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p></div>
        </div>
        <div className="flex items-center text-text-secondary"><div className="flex overflow-hidden rounded-lg border border-border-default"><button type="button" onClick={props.onPreviousMonth} aria-label="Previous month" className="flex h-11 w-11 items-center justify-center border-r border-border-default hover:bg-background-subtle"><LuChevronLeft size={21} /></button><button type="button" onClick={props.onToday} className="h-11 px-5 text-sm font-semibold text-text-primary hover:bg-background-subtle">Today</button><button type="button" onClick={props.onNextMonth} aria-label="Next month" className="flex h-11 w-11 items-center justify-center border-l border-border-default hover:bg-background-subtle"><LuChevronRight size={21} /></button></div></div>
      </header>
      <div className="grid grid-cols-7 border-b border-border-default">{WEEKDAYS.map((weekday) => <div key={weekday} className="py-2 text-center text-xs font-semibold text-text-tertiary">{weekday}</div>)}</div>
      {props.isLoading ? <div className="grid min-h-[600px] grid-cols-7 grid-rows-5">{days.map((day) => <div key={day.dateKey} className="animate-pulse border-b border-r border-border-default bg-background-subtle" />)}</div> : <div>{Array.from({ length: 5 }, (_, weekIndex) => <div key={days[weekIndex * 7].dateKey}>{_renderWeek(days.slice(weekIndex * 7, weekIndex * 7 + 7), props.onEventClick)}</div>)}</div>}
      {!props.isLoading && visibleEvents.length === 0 && <p className="sr-only">No quotation events in this month.</p>}
    </section>
  );
};
