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

export type CalendarPageState = {
  events: CalendarEventItem[];
  currentDate: Date;
  isLoading: boolean;
  isError: boolean;
  selectedDate: Date | null;
  selectedDayEvents: CalendarEventItem[];
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onSelectDate: (date: Date, events: CalendarEventItem[]) => void;
  onCloseDayModal: () => void;
  onNavigateToOrderDetail?: (orderId: string) => void;
};
