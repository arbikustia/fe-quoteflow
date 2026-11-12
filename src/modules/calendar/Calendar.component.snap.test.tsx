import test from "@/libs/unit-test";

import { CalendarPageComponent } from "./Calendar.component";
import type { CalendarPageState } from "./Calendar.type";

const props: CalendarPageState = {
  events: [{ id: "event-1", transactionId: "tx-1", title: "Pesta Nikah Budi", date: "2026-11-03", customerName: "Budi Santoso", quotationNo: "ORD-001", amount: 5000000, address: "Jakarta Selatan", variant: "green" }],
  currentDate: new Date(2026, 10, 3, 8),
  isLoading: false,
  isError: false,
  selectedDate: null,
  selectedDayEvents: [],
  onPreviousMonth: jest.fn(),
  onNextMonth: jest.fn(),
  onToday: jest.fn(),
  onSelectDate: jest.fn(),
  onCloseDayModal: jest.fn(),
  onNavigateToOrderDetail: jest.fn(),
};

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2026, 10, 3, 8));
});

afterAll(() => {
  jest.useRealTimers();
});

describe("CalendarPageComponent snapshot", () => {
  test.assertSnapshots(CalendarPageComponent, [
    { props, desc: "should render month with events" },
    { props: { ...props, isLoading: true, events: [] }, desc: "should render loading state" },
    { props: { ...props, selectedDate: new Date(2026, 10, 3, 8), selectedDayEvents: props.events }, desc: "should render selected day modal" },
  ]);
});
