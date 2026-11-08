import type { CalendarEventItem } from "@/components/Calendar";

export type ApiCalendarItem = {
  id: string;
  transaction_id: string;
  order_no: string;
  title: string;
  customer_name: string;
  event_name: string;
  address: string;
  start: string;
  end: string;
  total_amount: number;
  status: number;
};

export type CalendarQueryParams = {
  dateFrom: string;
  dateTo: string;
};

export type CalendarResponse = {
  status: boolean;
  data: ApiCalendarItem[];
  messages: string[];
};

export type CalendarNavigationState = {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
};

export type CalendarSelectionState = {
  selectedDate: Date | null;
  selectedDayEvents: CalendarEventItem[];
  onSelectDate: (date: Date, events: CalendarEventItem[]) => void;
  onCloseDayModal: () => void;
};

export type CalendarPageData = {
  events: CalendarEventItem[];
  isLoading: boolean;
  isError: boolean;
};

export type CalendarPageState = CalendarPageData & CalendarNavigationState & CalendarSelectionState & {
  onNavigateToOrderDetail?: (orderId: string) => void;
};
