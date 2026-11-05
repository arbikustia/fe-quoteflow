import type { ReactElement } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

import { buildCalendarDays, buildCalendarWeekEventSegments, formatCalendarMonth } from "./Calendar.helpers";
import type { CalendarComponentProps, CalendarDayCell, CalendarEventItem, CalendarEventVariantClasses, CalendarWeekEventSegment } from "./Calendar.type";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const EVENT_VARIANTS: CalendarEventVariantClasses = {
  neutral: "border-border-default bg-background-surface text-text-primary",
  blue: "border-primary-200 bg-primary-50 text-primary-700",
  pink: "border-pink-200 bg-pink-50 text-pink-700",
  green: "border-green-200 bg-green-50 text-green-700",
  purple: "border-purple-200 bg-purple-50 text-purple-700",
  orange: "border-orange-200 bg-orange-50 text-orange-700",
};

/**
 * Render one calendar event row.
 * @param {CalendarEventItem} event - Event item
 * @param {((event: CalendarEventItem) => void) | undefined} onEventClick - Click callback
 * @returns {ReactElement} Event pill button
 */
const _renderEvent = (event: CalendarEventItem, onEventClick: ((event: CalendarEventItem) => void) | undefined): ReactElement => (
  <button
    type="button"
    key={event.id}
    onClick={(e): void => {
      e.stopPropagation();
      onEventClick?.(event);
    }}
    className={`flex min-w-0 max-w-full w-full items-center gap-1 rounded-md border px-2 py-1 text-left text-xs font-semibold leading-tight transition-opacity hover:opacity-75 sm:text-sm lg:text-base ${EVENT_VARIANTS[event.variant ?? "neutral"]}`}
    title={event.title}
  >
    <span className="min-w-0 flex-1 truncate">{event.title}</span>
    {event.time && <span className="hidden shrink-0 text-xs font-medium opacity-75 lg:inline">{event.time}</span>}
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

const MAX_DASHBOARD_EVENTS = 1;
const MAX_MOBILE_EVENTS = 3;
const MAX_DESKTOP_EVENTS = 5;

/**
 * Render day events list.
 * @param {CalendarEventItem[]} events - Day events
 * @param {boolean} isDashboard - Whether calendar uses compact dashboard mode
 * @returns {ReactElement} Events container
 */
const _renderDayEvents = (events: CalendarEventItem[], isDashboard: boolean): ReactElement => {
  const dashboardRemainingCount = events.length - MAX_DASHBOARD_EVENTS;
  const mobileRemainingCount = events.length - MAX_MOBILE_EVENTS;
  const desktopRemainingCount = events.length - MAX_DESKTOP_EVENTS;

  if (isDashboard) {
    return (
      <div className="mt-12">
        {dashboardRemainingCount > 0 && (
          <span className="block px-1 text-xs font-semibold text-text-secondary">
            +{dashboardRemainingCount} more {dashboardRemainingCount === 1 ? "event" : "events"}
          </span>
        )}
      </div>
    );
  }

  return (
    <div>
      {mobileRemainingCount > 0 && (
        <span className="absolute left-2 top-[9.5rem] z-20 block text-xs font-semibold text-text-secondary lg:hidden">
          +{mobileRemainingCount} more
        </span>
      )}
      {desktopRemainingCount > 0 && (
        <span className="absolute left-2 top-[14.5rem] z-20 hidden text-xs font-semibold text-text-secondary lg:block">
          +{desktopRemainingCount} more
        </span>
      )}
    </div>
  );
};

/**
 * Return background and interaction class for calendar day cell.
 * @param {CalendarDayCell} day - Day item
 * @param {boolean} isExpanded - Use expanded height
 * @param {boolean} isClickable - Whether date is clickable
 * @returns {string} CSS class
 */
const _getDayCellClassName = (day: CalendarDayCell, isExpanded: boolean, isClickable: boolean): string => {
  const heightClass = isExpanded ? "min-h-[6rem]" : "min-h-[20dvh] lg:aspect-square lg:min-h-0";

  if (!day.isCurrentMonth) {
    return `relative ${heightClass} min-w-0 overflow-hidden border-r border-border-default p-2 pointer-events-none bg-background-subtle`;
  }

  const hoverClass = isClickable
    ? "cursor-pointer transition-colors hover:bg-background-subtle/50 focus:outline-none focus-visible:ring-1 focus-visible:ring-focus-ring"
    : "";

  return `relative ${heightClass} min-w-0 overflow-hidden border-r border-border-default p-2 ${hoverClass}`;
};

/**
 * Render single day cell.
 * @param {CalendarDayCell} day - Day item
 * @param {boolean} isExpanded - Expanded dashboard mode
 * @param {((date: Date, events: CalendarEventItem[]) => void) | undefined} onDateClick - Date click callback
 * @returns {ReactElement} Day cell
 */
const _renderDayCell = (
  day: CalendarDayCell,
  isExpanded: boolean,
  onDateClick?: ((date: Date, events: CalendarEventItem[]) => void) | undefined,
): ReactElement => {
  const isClickable = Boolean(onDateClick && day.isCurrentMonth);

  return (
    <div
      key={day.dateKey}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={(): void => {
        if (day.isCurrentMonth && onDateClick) {
          onDateClick(day.date, day.events);
        }
      }}
      onKeyDown={(event): void => {
        if (day.isCurrentMonth && onDateClick && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onDateClick(day.date, day.events);
        }
      }}
      aria-disabled={!day.isCurrentMonth}
      className={_getDayCellClassName(day, isExpanded, isClickable)}
    >
      <span className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs font-semibold ${_getDayNumberClassName(day)}`}>
        {day.dayNumber}
      </span>
      {day.isCurrentMonth && _renderDayEvents(day.events, isExpanded)}
    </div>
  );
};

/**
 * Render responsive event bar segment.
 * @param {CalendarWeekEventSegment} segment - Calendar segment
 * @param {"mobile" | "desktop"} viewport - Target viewport
 * @param {((event: CalendarEventItem) => void) | undefined} onEventClick - Event callback
 * @returns {ReactElement} Event segment
 */
const _renderEventSegment = (segment: CalendarWeekEventSegment, viewport: "mobile" | "desktop", onEventClick: ((event: CalendarEventItem) => void) | undefined): ReactElement => {
  const isMobile = viewport === "mobile";

  return (
    <div
      key={`${viewport}-${segment.event.id}-${segment.startColumn}`}
      className={`absolute z-10 ${isMobile ? "block lg:hidden" : "hidden lg:block"}`}
      style={{
        left: `calc(${(segment.startColumn * 100) / 7}% + ${isMobile ? "0.25rem" : "0.5rem"})`,
        width: `calc(${(segment.span * 100) / 7}% - ${isMobile ? "0.5rem" : "1rem"})`,
        top: `${2.25 + segment.row * 2.5}rem`,
      }}
    >
      {_renderEvent(segment.event, onEventClick)}
    </div>
  );
};

/**
 * Render one week with continuous multi-day event bars.
 * @param {CalendarDayCell[]} weekDays - Week cells
 * @param {((event: CalendarEventItem) => void) | undefined} onEventClick - Event callback
 * @param {boolean} isExpanded - Use expanded dashboard mode
 * @param {((date: Date, events: CalendarEventItem[]) => void) | undefined} onDateClick - Date click callback
 * @returns {ReactElement} Week row
 */
const _renderWeek = (
  weekDays: CalendarDayCell[],
  onEventClick: ((event: CalendarEventItem) => void) | undefined,
  isExpanded: boolean,
  onDateClick?: ((date: Date, events: CalendarEventItem[]) => void) | undefined,
): ReactElement => {
  const segments = buildCalendarWeekEventSegments(weekDays);

  return (
    <div className="relative grid grid-cols-7 border-b border-border-default">
      {weekDays.map((day) => _renderDayCell(day, isExpanded, onDateClick))}
      {segments.filter((segment) => segment.row < (isExpanded ? MAX_DASHBOARD_EVENTS : MAX_MOBILE_EVENTS)).map((segment) => _renderEventSegment(segment, "mobile", onEventClick))}
      {segments.filter((segment) => segment.row < (isExpanded ? MAX_DASHBOARD_EVENTS : MAX_DESKTOP_EVENTS)).map((segment) => _renderEventSegment(segment, "desktop", onEventClick))}
    </div>
  );
};

/**
 * Render calendar navigation controls.
 * @param {CalendarComponentProps} props - Props with navigation callbacks
 * @returns {ReactElement} Controls element
 */
const _renderCalendarControls = (props: CalendarComponentProps): ReactElement => (
  <div className="flex shrink-0 items-center text-text-secondary">
    <div className="flex overflow-hidden rounded-3xl border border-border-default">
      <button type="button" onClick={props.onPreviousMonth} aria-label="Previous month" className="flex h-10 w-10 items-center justify-center border-r border-border-default hover:bg-background-subtle sm:h-12 sm:w-12">
        <LuChevronLeft size={20} />
      </button>
      <button type="button" onClick={props.onToday} className="h-10 px-4 text-sm font-semibold text-text-primary hover:bg-background-subtle sm:h-12 sm:px-6 sm:text-base">
        Today
      </button>
      <button type="button" onClick={props.onNextMonth} aria-label="Next month" className="flex h-10 w-10 items-center justify-center border-l border-border-default hover:bg-background-subtle sm:h-12 sm:w-12">
        <LuChevronRight size={20} />
      </button>
    </div>
  </div>
);

/**
 * Render calendar header control bar.
 * @param {Date} currentDate - Current calendar date
 * @param {string} monthLabel - Formatted month label
 * @param {CalendarComponentProps} props - Props with navigation callbacks
 * @returns {ReactElement} Calendar header
 */
const _renderCalendarHeader = (
  currentDate: Date,
  monthLabel: string,
  props: CalendarComponentProps,
): ReactElement => (
  <header className="flex min-h-20 items-center justify-between gap-3 border-b border-border-default px-4 py-4 sm:px-6 lg:min-h-24 lg:gap-6 lg:px-8 lg:py-5">
    <div className="min-w-0 flex-1">
      <h1 className="truncate text-lg font-bold text-text-primary sm:text-xl lg:text-2xl">{monthLabel}</h1>
      <p className="mt-0.5 truncate text-xs font-medium text-text-secondary sm:text-sm lg:mt-1 lg:text-base">
        {new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} – {new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </p>
    </div>
    {props.showControls !== false && _renderCalendarControls(props)}
  </header>
);

/**
 * Render reusable month calendar.
 * @param {CalendarComponentProps} props - Calendar properties
 * @returns {ReactElement} Calendar element
 */
export const CalendarComponent = (props: CalendarComponentProps): ReactElement => {
  const currentDate = props.currentDate ?? new Date();
  const days = buildCalendarDays(currentDate, props.events);
  const monthLabel = formatCalendarMonth(currentDate);
  const visibleEvents = days.flatMap((day) => day.events).filter((event, index, events) => events.findIndex((candidate) => candidate.id === event.id) === index);
  const isDashboard = props.showControls === false;

  return (
    <section className={`overflow-hidden rounded-3xl border border-border-default bg-background-surface ${props.className ?? ""}`} aria-label={`${monthLabel} calendar`}>
      {_renderCalendarHeader(currentDate, monthLabel, props)}
      <div className="grid grid-cols-7 border-b border-border-default">
        {WEEKDAYS.map((weekday) => (
          <div key={weekday} className="py-3 text-center text-sm font-semibold text-text-tertiary">
            {weekday}
          </div>
        ))}
      </div>
      {props.isLoading ? <div className="grid min-h-[100dvh] grid-cols-7 grid-rows-5 lg:min-h-[600px]">{days.map((day) => <div key={day.dateKey} className="animate-pulse border-b border-r border-border-default bg-background-subtle" />)}</div> : <div>{Array.from({ length: 5 }, (_, weekIndex) => <div key={days[weekIndex * 7].dateKey}>{_renderWeek(days.slice(weekIndex * 7, weekIndex * 7 + 7), props.onEventClick, isDashboard, props.onDateClick)}</div>)}</div>}
      {!props.isLoading && visibleEvents.length === 0 && <p className="sr-only">No quotation events in this month.</p>}
    </section>
  );
};
