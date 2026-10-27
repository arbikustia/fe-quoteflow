import { render, screen } from "@testing-library/react";

import { DatePicker } from "./DatePicker.component";

describe("DatePicker", () => {
  it("should render label and selected date", (): void => {
    render(<DatePicker label="Start date" value="2026-10-14" />);

    expect(screen.getByText("Start date")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("2026-10-14");
  });

  it("should render required error state", (): void => {
    render(<DatePicker id="paid-at" label="Paid at" required errorMessage="Paid at is required." />);

    expect(screen.getByRole("alert")).toHaveTextContent("Paid at is required.");
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });
});
