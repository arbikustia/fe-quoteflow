import { fireEvent, render, screen } from "@testing-library/react";

import { DateRangePicker } from "./DateRangePicker.component";

describe("DateRangePicker", () => {
  it("renders label and start/end dates", () => {
    render(<DateRangePicker label="Period" startDate="2023-01-01" endDate="2023-01-31" />);
    expect(screen.getByText("Period")).toBeInTheDocument();
    expect(screen.getByLabelText("Start date")).toHaveValue("2023-01-01");
    expect(screen.getByLabelText("End date")).toHaveValue("2023-01-31");
  });

  it("calls onStartDateChange and onEndDateChange", () => {
    const onStart = jest.fn();
    const onEnd = jest.fn();
    render(<DateRangePicker onStartDateChange={onStart} onEndDateChange={onEnd} />);
    fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2023-02-01" } });
    fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2023-02-28" } });
    expect(onStart).toHaveBeenCalled();
    expect(onEnd).toHaveBeenCalled();
  });

  it("renders compact variant", () => {
    render(<DateRangePicker variant="compact" label="Period" />);
    expect(screen.getByLabelText("Start date")).toBeInTheDocument();
    expect(screen.getByLabelText("End date")).toBeInTheDocument();
  });
});
