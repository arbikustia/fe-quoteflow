import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { ReactElement } from "react";
import type { NavigateFunction } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { fireEvent, render, screen } from "@/libs/unit-test";

import { CalendarContainer } from "./Calendar.container";
import { useCalendarQuotations } from "./Calendar.hook";
import type { CalendarPageState } from "./Calendar.type";

jest.mock("react-router-dom", () => ({ useNavigate: jest.fn() }));
jest.mock("./Calendar.hook", () => ({ useCalendarQuotations: jest.fn() }));
jest.mock("./Calendar.component", () => ({
  CalendarPageComponent: (props: CalendarPageState): ReactElement => {
    /** Navigate to the test order. */
    const handleNavigate = (): void => props.onNavigateToOrderDetail?.("order-1");

    return <button type="button" onClick={handleNavigate}>Open order</button>;
  },
}));

const calendarState: CalendarPageState = {
  events: [],
  currentDate: new Date("2026-11-01T00:00:00.000Z"),
  isLoading: false,
  isError: false,
  selectedDate: null,
  selectedDayEvents: [],
  onPreviousMonth: jest.fn(),
  onNextMonth: jest.fn(),
  onToday: jest.fn(),
  onSelectDate: jest.fn(),
  onCloseDayModal: jest.fn(),
};

describe("CalendarContainer", (): void => {
  const navigateMock = jest.fn<(to: string) => void>();
  const navigate: NavigateFunction = Object.assign(
    (to: string | number): void => {
      if (typeof to === "string") navigateMock(to);
    },
  );

  beforeEach((): void => {
    jest.clearAllMocks();
    jest.mocked(useNavigate).mockReturnValue(navigate);
    jest.mocked(useCalendarQuotations).mockReturnValue(calendarState);
  });

  it("should render calendar component with hook state", (): void => {
    render(<CalendarContainer />);

    expect(screen.getByRole("button", { name: "Open order" })).toBeTruthy();
    expect(useCalendarQuotations).toHaveBeenCalledTimes(1);
  });

  it("should navigate to selected order detail", (): void => {
    render(<CalendarContainer />);

    fireEvent.click(screen.getByRole("button", { name: "Open order" }));

    expect(navigateMock).toHaveBeenCalledWith("/order/detail/order-1");
  });
});
