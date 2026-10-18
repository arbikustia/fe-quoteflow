import { fireEvent, render, screen } from "@testing-library/react";

import { DateRangePicker } from "./DateRangePicker.component";

describe("DateRangePicker", () => {
  it("should render label and start/end dates", (): void => {
    render(<DateRangePicker label="Period" startDate="2023-01-01" endDate="2023-01-31" onStartDateChange={jest.fn()} onEndDateChange={jest.fn()} />);

    expect(screen.getByText("Period")).toBeInTheDocument();
    expect(screen.getByLabelText("Start date")).toHaveValue("2023-01-01");
    expect(screen.getByLabelText("End date")).toHaveValue("2023-01-31");
  });

  it("should call start and end date change handlers", (): void => {
    const onStart = jest.fn();
    const onEnd = jest.fn();
    render(<DateRangePicker onStartDateChange={onStart} onEndDateChange={onEnd} />);

    fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2023-02-01" } });
    fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2023-02-28" } });

    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it("should render compact variant", (): void => {
    render(<DateRangePicker variant="compact" label="Period" />);

    expect(screen.getByLabelText("Start date")).toBeInTheDocument();
    expect(screen.getByLabelText("End date")).toBeInTheDocument();
  });

  it("should open native picker for both dates", (): void => {
    const showPicker = jest.fn();
    render(<DateRangePicker />);
    const inputs = [screen.getByLabelText("Start date"), screen.getByLabelText("End date")];
    inputs.forEach((input) => Object.defineProperty(input, "showPicker", { value: showPicker }));

    inputs.forEach((input) => fireEvent.click(input));

    expect(showPicker).toHaveBeenCalledTimes(2);
  });
});

