import { useEffect, useState } from "react";

import { useMasterActivityLog } from "@/hooks/useMasterActivityLog";

import type { CalendarEventItem } from "@/components/Calendar";

import { getCalendarMonthRange, mapCalendarItemToEvent } from "./Calendar.helpers";
import type { CalendarNavigationState,CalendarPageState } from "./Calendar.type";

import { useGetCalendarEventsQuery } from "@/services/calendar.service";

/**
 * Record calendar page view.
 * @param {() => Promise<void>} logView - Activity logger
 * @returns {() => void} Effect cleanup
 */
const _trackCalendarView = (logView: () => Promise<void>): (() => void) => {
  let active = true;

  void logView().then(() => {
    if (!active) return;
  });

  return (): void => {
    active = false;
  };
};

/**
 * Manage calendar navigation state.
 * @returns {CalendarNavigationState} Navigation state and handlers
 */
const useCalendarNavigation = (): CalendarNavigationState => {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  /**
   * Move calendar month.
   * @param {number} offset - Month offset
   * @returns {void} No return value
   */
  const onMoveMonth = (offset: number): void => setCurrentDate((previousDate) => new Date(previousDate.getFullYear(), previousDate.getMonth() + offset, 1));

  /**
   * Navigate to previous month.
   * @returns {void} No return value
   */
  const onPreviousMonth = (): void => onMoveMonth(-1);

  /**
   * Navigate to next month.
   * @returns {void} No return value
   */
  const onNextMonth = (): void => onMoveMonth(1);

  /**
   * Navigate to current month.
   * @returns {void} No return value
   */
  const onToday = (): void => setCurrentDate(new Date());

  return { currentDate, onPreviousMonth, onNextMonth, onToday };
};

/**
 * Load calendar events for the calendar page.
 * @returns {CalendarPageState} Calendar page state and handlers
 */
export const useCalendarQuotations = (): CalendarPageState => {
  const navigation = useCalendarNavigation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEventItem[]>([]);
  const { logView } = useMasterActivityLog("Calendar");
  const { currentDate, onPreviousMonth, onNextMonth, onToday } = navigation;

  useEffect(() => _trackCalendarView(logView), [logView]);

  const range = getCalendarMonthRange(currentDate);
  const calendarQuery = useGetCalendarEventsQuery(range);

  /**
   * Select a date and its calendar events.
   * @param {Date} date - Selected calendar date
   * @param {CalendarEventItem[]} events - Events on the selected date
   * @returns {void} No return value
   */
  const onSelectDate = (date: Date, events: CalendarEventItem[]): void => {
    setSelectedDate(date);
    setSelectedDayEvents(events);
  };

  /** Close the selected day modal. */
  const onCloseDayModal = (): void => {
    setSelectedDate(null);
    setSelectedDayEvents([]);
  };

  const events = calendarQuery.data?.status && calendarQuery.data.data
    ? calendarQuery.data.data.map(mapCalendarItemToEvent)
    : [];

  return {
    events,
    ...navigation,
    isLoading: calendarQuery.isLoading,
    isError: calendarQuery.isError || (Boolean(calendarQuery.data) && !calendarQuery.data?.status),
    selectedDate,
    selectedDayEvents,
    onPreviousMonth,
    onNextMonth,
    onToday,
    onSelectDate,
    onCloseDayModal,
  };
};

export const useCalendarEvents = useCalendarQuotations;
