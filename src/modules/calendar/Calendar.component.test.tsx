import { fireEvent, render, screen, within } from "@testing-library/react";

import type { CalendarEventItem } from "@/components/Calendar";

import { CalendarPageComponent } from "./Calendar.component";
import type { CalendarPageState } from "./Calendar.type";

describe("CalendarPageComponent", () => {
  const mockEvent: CalendarEventItem = {
    id: "event-1",
    transactionId: "tx-1",
    title: "Pesta Nikah Budi",
    date: "2026-11-03",
    customerName: "Budi Santoso",
    quotationNo: "ORD-001",
    amount: 5000000,
    address: "Jakarta Selatan",
    variant: "green",
  };

  const defaultProps: CalendarPageState = {
    events: [mockEvent],
    currentDate: new Date(2026, 10, 3),
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

  it("should render calendar and not show modal when selectedDate is null", () => {
    render(<CalendarPageComponent {...defaultProps} />);

    expect(screen.getByLabelText(/November 2026 calendar/i)).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should show modal with day events when selectedDate is provided", () => {
    render(
      <CalendarPageComponent
        {...defaultProps}
        selectedDate={new Date(2026, 10, 3)}
        selectedDayEvents={[mockEvent]}
      />,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText("Pesta Nikah Budi")).toBeInTheDocument();
    expect(within(dialog).getByText("#ORD-001")).toBeInTheDocument();
    expect(within(dialog).getByText("Budi Santoso")).toBeInTheDocument();
    expect(within(dialog).getByText("Jakarta Selatan")).toBeInTheDocument();
    expect(within(dialog).getByText("Rp 5.000.000")).toBeInTheDocument();
  });

  it("should call onNavigateToOrderDetail when detail button is clicked", () => {
    const onNavigate = jest.fn();
    render(
      <CalendarPageComponent
        {...defaultProps}
        selectedDate={new Date(2026, 10, 3)}
        selectedDayEvents={[mockEvent]}
        onNavigateToOrderDetail={onNavigate}
      />,
    );

    const button = screen.getByRole("button", { name: /Lihat Detail Order/i });
    fireEvent.click(button);

    expect(onNavigate).toHaveBeenCalledWith("tx-1");
  });

  it("should show empty state in modal when day has no events", () => {
    render(
      <CalendarPageComponent
        {...defaultProps}
        selectedDate={new Date(2026, 10, 5)}
        selectedDayEvents={[]}
      />,
    );

    expect(screen.getByText("Tidak Ada Jadwal")).toBeInTheDocument();
  });
});
