import type { CalendarEventItem } from "@/components/Calendar";

export type CalendarPageState = {
  events: CalendarEventItem[];
  currentDate: Date;
  isLoading: boolean;
  isError: boolean;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
};
