import { act, renderHook } from "@testing-library/react";

import { useGetCalendarEventsQuery } from "@/services/calendar.service";

import { useCalendarQuotations } from "./Calendar.hook";

jest.mock("@/services/calendar.service", () => ({
  useGetCalendarEventsQuery: jest.fn(),
}));

jest.mock("@/services/activity-log.service", () => ({
  useCreateActivityLogMutation: () => [jest.fn().mockReturnValue({ unwrap: jest.fn().mockResolvedValue({}) }), { isLoading: false }],
}));

const mockCalendarQuery = jest.mocked(useGetCalendarEventsQuery);

describe("useCalendarQuotations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch calendar events for current month range", () => {
    mockCalendarQuery.mockReturnValue({
      data: {
        status: true,
        data: [
          {
            id: "event-1",
            transaction_id: "tx-1",
            order_no: "ORD-001",
            title: "Pesta Nikah",
            customer_name: "Budi",
            event_name: "Wedding",
            address: "Jakarta",
            start: "2026-11-03T09:49:04.348Z",
            end: "2026-11-03T09:49:04.348Z",
            total_amount: 1000000,
            status: 1,
          },
        ],
        messages: ["success"],
      },
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useGetCalendarEventsQuery>);

    const { result } = renderHook(() => useCalendarQuotations());

    expect(mockCalendarQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        dateFrom: expect.any(String),
        dateTo: expect.any(String),
      }),
    );
    expect(result.current.events).toHaveLength(1);
    expect(result.current.events[0].title).toBe("Pesta Nikah");
    expect(result.current.events[0].amount).toBe(1000000);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("should navigate to previous and next month", () => {
    mockCalendarQuery.mockReturnValue({
      data: { status: true, data: [], messages: [] },
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useGetCalendarEventsQuery>);

    const { result } = renderHook(() => useCalendarQuotations());
    const initialMonth = result.current.currentDate.getMonth();

    act(() => {
      result.current.onNextMonth();
    });

    expect(result.current.currentDate.getMonth()).toBe((initialMonth + 1) % 12);

    act(() => {
      result.current.onPreviousMonth();
    });

    expect(result.current.currentDate.getMonth()).toBe(initialMonth);

    act(() => {
      result.current.onToday();
    });

    expect(result.current.currentDate.getDate()).toBe(new Date().getDate());
  });

  it("should manage selectedDate and selectedDayEvents via onSelectDate and onCloseDayModal", () => {
    mockCalendarQuery.mockReturnValue({
      data: { status: true, data: [], messages: [] },
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof useGetCalendarEventsQuery>);

    const { result } = renderHook(() => useCalendarQuotations());

    expect(result.current.selectedDate).toBeNull();
    expect(result.current.selectedDayEvents).toEqual([]);

    const sampleDate = new Date(2026, 10, 3);
    const sampleEvents = [{ id: "1", title: "Event", date: "2026-11-03" }];

    act(() => {
      result.current.onSelectDate(sampleDate, sampleEvents);
    });

    expect(result.current.selectedDate).toEqual(sampleDate);
    expect(result.current.selectedDayEvents).toEqual(sampleEvents);

    act(() => {
      result.current.onCloseDayModal();
    });

    expect(result.current.selectedDate).toBeNull();
    expect(result.current.selectedDayEvents).toEqual([]);
  });

  it("should report error when API fails", () => {
    mockCalendarQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as unknown as ReturnType<typeof useGetCalendarEventsQuery>);

    const { result } = renderHook(() => useCalendarQuotations());

    expect(result.current.isError).toBe(true);
    expect(result.current.events).toEqual([]);
  });
});
