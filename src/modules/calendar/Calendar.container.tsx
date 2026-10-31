import type { ReactElement } from "react";

import { CalendarPageComponent } from "./Calendar.component";
import { useCalendarQuotations } from "./Calendar.hook";

/** Render calendar container with quotation events. */
export const CalendarContainer = (): ReactElement => {
  const calendarState = useCalendarQuotations();

  return <CalendarPageComponent {...calendarState} />;
};

export default CalendarContainer;
