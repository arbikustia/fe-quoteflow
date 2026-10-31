export type CalendarEventVariant = "neutral" | "blue" | "pink" | "green" | "purple" | "orange";

export type CalendarEventItem = {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  time?: string;
  variant?: CalendarEventVariant;
  quotationNo?: string;
  customerName?: string;
  amount?: number;
};

export type CalendarDayCell = {
  date: Date;
  dateKey: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEventItem[];
};

export type CalendarWeekEventSegment = {
  event: CalendarEventItem;
  startColumn: number;
  span: number;
  row: number;
  isStart: boolean;
  isEnd: boolean;
};

export type CalendarViewMode = "month" | "week";

export type CalendarComponentProps = {
  events: CalendarEventItem[];
  currentDate?: Date;
  isLoading?: boolean;
  onEventClick?: (event: CalendarEventItem) => void;
  onPreviousMonth?: () => void;
  onNextMonth?: () => void;
  onToday?: () => void;
  className?: string;
};

export type CalendarEventVariantClasses = {
  neutral: string;
  blue: string;
  pink: string;
  green: string;
  purple: string;
  orange: string;
};
