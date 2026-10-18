import { fireEvent, render, screen } from "@testing-library/react";

import { DatePicker } from "./DatePicker.component";

describe("DatePicker", () => {
  it("should render label and selected date", (): void => {
    render(<DatePicker label="Start date" defaultValue="2026-10-14" />);

    expect(screen.getByText("Start date")).toBeInTheDocument();
    expect(screen.getByLabelText("Start date")).toHaveValue("2026-10-14");
  });

  it("should call onChange when a date is selected", (): void => {
    const onChange = jest.fn();
    render(<DatePicker label="End date" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2026-10-15" } });

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("should open native picker and call click handler", (): void => {
    const onClick = jest.fn();
    const showPicker = jest.fn();
    render(<DatePicker aria-label="Rental date" onClick={onClick} />);
    const input = screen.getByLabelText("Rental date");
    Object.defineProperty(input, "showPicker", { value: showPicker });

    fireEvent.click(input);

    expect(showPicker).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
