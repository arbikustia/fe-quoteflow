import type { CalendarDayCell, CalendarEventItem, CalendarWeekEventSegment } from "./Calendar.type";

const WEEKDAY_COUNT = 7;
const MONTH_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", { month: "short" });

/**
 * Convert date into stable local calendar key.
 * @param {Date} date - Calendar date
 * @returns {string} Stable local date key
 */
export const getCalendarDateKey = (date: Date): string => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

/**
 * Build five-week month grid matching calendar month layout.
 * @param {Date} currentDate - Month to display
 * @param {CalendarEventItem[]} events - Calendar events
 * @returns {CalendarDayCell[]} Calendar day cells
 */
export const buildCalendarDays = (currentDate: Date, events: CalendarEventItem[]): CalendarDayCell[] => {
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const gridStart = new Date(firstDay);

  gridStart.setDate(firstDay.getDate() - firstDay.getDay());

  const todayKey = getCalendarDateKey(new Date());

  return Array.from({ length: WEEKDAY_COUNT * 5 }, (_, index) => {
    const date = new Date(gridStart);

    date.setDate(gridStart.getDate() + index);

    const dateKey = getCalendarDateKey(date);
    const dayEvents = events.filter((event) => event.date === dateKey || (event.endDate !== undefined && event.date <= dateKey && dateKey <= event.endDate));

    return { date, dateKey, dayNumber: date.getDate(), isCurrentMonth: date.getMonth() === currentDate.getMonth(), isToday: dateKey === todayKey, events: dayEvents };
  });
};

/**
 * Build uninterrupted event bar segments for one calendar week.
 * @param {CalendarDayCell[]} weekDays - Seven day cells
 * @returns {CalendarWeekEventSegment[]} Week event bar segments
 */
export const buildCalendarWeekEventSegments = (weekDays: CalendarDayCell[]): CalendarWeekEventSegment[] => {
  const firstDateKey = weekDays[0].dateKey;
  const lastDateKey = weekDays[WEEKDAY_COUNT - 1].dateKey;
  const weekEvents = weekDays.flatMap((day) => day.events).filter((event, index, events) => events.findIndex((candidate) => candidate.id === event.id) === index).filter((event) => event.endDate !== undefined && event.endDate !== event.date);
  const occupiedColumns: boolean[][] = [];

  return weekEvents.map((event) => {
    const startColumn = Math.max(0, weekDays.findIndex((day) => day.dateKey === event.date));
    const endColumn = Math.min(WEEKDAY_COUNT - 1, weekDays.findIndex((day) => day.dateKey === event.endDate));
    const actualStartColumn = event.date < firstDateKey ? 0 : startColumn;
    const eventEndDate = event.endDate ?? event.date;
    const actualEndColumn = eventEndDate > lastDateKey ? WEEKDAY_COUNT - 1 : endColumn;
    const span = actualEndColumn - actualStartColumn + 1;
    let row = 0;

    while (occupiedColumns[row]?.slice(actualStartColumn, actualEndColumn + 1).some(Boolean)) {
      row += 1;
    }

    if (!occupiedColumns[row]) {
      occupiedColumns[row] = Array.from({ length: WEEKDAY_COUNT }, () => false);
    }

    for (let column = actualStartColumn; column <= actualEndColumn; column += 1) {
      occupiedColumns[row][column] = true;
    }

    return { event, startColumn: actualStartColumn, span, row, isStart: event.date >= firstDateKey, isEnd: eventEndDate <= lastDateKey };
  });
};

/**
 * Format month heading.
 * @param {Date} date - Month date
 * @returns {string} Localized month heading
 */
export const formatCalendarMonth = (date: Date): string => `${date.toLocaleDateString("en-US", { month: "long" })} ${date.getFullYear()}`;

/**
 * Format event display time from quotation date.
 * @param {string} date - Event ISO date
 * @returns {string} Localized time or empty string
 */
export const formatCalendarTime = (date: string): string => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

/**
 * Return month abbreviation for header badge.
 * @param {Date} date - Month date
 * @returns {string} Uppercase month abbreviation
 */
export const formatCalendarMonthShort = (date: Date): string => MONTH_DATE_FORMATTER.format(date).toUpperCase();
