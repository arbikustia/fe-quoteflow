import { useEffect, useState } from "react";

import { useMasterActivityLog } from "@/hooks/useMasterActivityLog";

import type { CalendarEventItem } from "@/components/Calendar";

import { useGetCalendarEventsQuery } from "@/services/calendar.service";

import { getCalendarMonthRange, mapCalendarItemToEvent } from "./Calendar.helpers";
import type { CalendarPageState } from "./Calendar.type";

/** Load calendar events for calendar page. */
export const useCalendarQuotations = (): CalendarPageState => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEventItem[]>([]);
  const { logView } = useMasterActivityLog("Calendar");

  useEffect(() => {
    let active = true;
    void logView().then(() => {
      if (!active) return;
    });

    return () => {
      active = false;
    };
  }, [logView]);

  const range = getCalendarMonthRange(currentDate);
  const calendarQuery = useGetCalendarEventsQuery(range);

  const onPreviousMonth = (): void => {
    setCurrentDate((previousDate) => new Date(previousDate.getFullYear(), previousDate.getMonth() - 1, 1));
  };

  const onNextMonth = (): void => {
    setCurrentDate((previousDate) => new Date(previousDate.getFullYear(), previousDate.getMonth() + 1, 1));
  };

  const onToday = (): void => {
    setCurrentDate(new Date());
  };

  const onSelectDate = (date: Date, events: CalendarEventItem[]): void => {
    setSelectedDate(date);
    setSelectedDayEvents(events);
  };

  const onCloseDayModal = (): void => {
    setSelectedDate(null);
    setSelectedDayEvents([]);
  };

  const events = calendarQuery.data?.status && calendarQuery.data.data
    ? calendarQuery.data.data.map(mapCalendarItemToEvent)
    : [];

  return {
    events,
    currentDate,
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
