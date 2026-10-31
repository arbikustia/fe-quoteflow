import { useState } from "react";

import { useGetQuotationsQuery } from "@/services/quotation.service";

import { mapQuotationToCalendarEvent } from "./Calendar.helpers";
import type { CalendarPageState } from "./Calendar.type";

/** Load quotation events for calendar page. */
export const useCalendarQuotations = (): CalendarPageState => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const quotationQuery = useGetQuotationsQuery({ pageNumber: 1, pageSize: 1000, searchTerm: "" });

  const onPreviousMonth = (): void => {
    setCurrentDate((previousDate) => new Date(previousDate.getFullYear(), previousDate.getMonth() - 1, 1));
  };

  const onNextMonth = (): void => {
    setCurrentDate((previousDate) => new Date(previousDate.getFullYear(), previousDate.getMonth() + 1, 1));
  };

  const onToday = (): void => {
    setCurrentDate(new Date());
  };

  if (!quotationQuery.data) {
    return { events: [], currentDate, isLoading: quotationQuery.isLoading, isError: quotationQuery.isError, onPreviousMonth, onNextMonth, onToday };
  }

  return {
    events: quotationQuery.data.data.map(mapQuotationToCalendarEvent),
    currentDate,
    isLoading: quotationQuery.isLoading,
    isError: quotationQuery.isError,
    onPreviousMonth,
    onNextMonth,
    onToday,
  };
};
