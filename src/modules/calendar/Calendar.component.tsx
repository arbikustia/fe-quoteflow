import type { ReactElement } from "react";

import { CalendarComponent } from "@/components/Calendar";

import type { CalendarPageState } from "./Calendar.type";

/** Render quotation calendar page content. */
export const CalendarPageComponent = (props: CalendarPageState): ReactElement => (
  <CalendarComponent events={props.events} currentDate={props.currentDate} isLoading={props.isLoading} onPreviousMonth={props.onPreviousMonth} onNextMonth={props.onNextMonth} onToday={props.onToday} />
);
