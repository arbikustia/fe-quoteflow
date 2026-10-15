import { fireEvent, render, screen } from "@testing-library/react";

import { DatePicker } from "./DatePicker.component";

describe("DatePicker", () => {
  it("renders label and selected date", (): void => {
    render(<DatePicker label="Start date" value="2026-10-14" />);

    expect(screen.getByText("Start date")).toBeInTheDocument();
    expect(screen.getByLabelText("Start date")).toHaveValue("2026-10-14");
  });

  it("calls onChange when a date is selected", (): void => {
    const onChange = jest.fn();
    render(<DatePicker label="End date" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2026-10-15" } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
