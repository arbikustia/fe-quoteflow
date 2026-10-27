import { fireEvent, render, screen } from "@testing-library/react";

import { DateRangePicker } from "./DateRangePicker.component";

describe("DateRangePicker", () => {
  it("should render custom calendar buttons", (): void => {
    render(<DateRangePicker showTime />);

    fireEvent.click(screen.getByRole("textbox", { name: "Start Date" }));

    expect(screen.getByRole("button", { name: "Previous month" })).toBeInTheDocument();
  });
  it("should render label and start/end dates", (): void => {
    render(<DateRangePicker label="Period" startDate="2023-01-01" endDate="2023-01-31" onStartDateChange={jest.fn()} onEndDateChange={jest.fn()} />);

    expect(screen.getByText("Period")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Start Date" })).toHaveValue("2023-01-01");
    expect(screen.getByRole("textbox", { name: "End Date" })).toHaveValue("2023-01-31");
  });

  it("should call start and end date change handlers", (): void => {
    const onStart = jest.fn();
    const onEnd = jest.fn();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2023-02-01T00:00:00"));
    render(<DateRangePicker onStartDateChange={onStart} onEndDateChange={onEnd} />);

    fireEvent.click(screen.getByRole("textbox", { name: "Start Date" }));
    fireEvent.click(screen.getByTitle("2023-02-01"));
    fireEvent.click(screen.getByRole("textbox", { name: "End Date" }));
    fireEvent.click(screen.getAllByTitle("2023-02-28")[1]);

    expect(onStart).toHaveBeenCalledWith("2023-02-01");
    expect(onEnd).toHaveBeenCalledWith("2023-02-28");
    jest.useRealTimers();
  });

  it("should render compact variant", (): void => {
    render(<DateRangePicker variant="compact" label="Period" />);

    expect(screen.getByRole("textbox", { name: "Start Date" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "End Date" })).toBeInTheDocument();
  });

  it("should open date pickers for both dates", (): void => {
    render(<DateRangePicker />);

    fireEvent.click(screen.getByRole("textbox", { name: "Start Date" }));
    expect(screen.getByRole("button", { name: "Previous month" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("textbox", { name: "End Date" }));
    expect(screen.getAllByRole("button", { name: "Previous month" })).toHaveLength(2);
  });
});

