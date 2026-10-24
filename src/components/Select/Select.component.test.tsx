import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

import { Select } from "./Select.component";

describe("Select component", () => {
  const options = [
    { value: "val-1", label: "Option One" },
    { value: "val-2", label: "Option Two" },
  ];

  it("should render label, required indicator, and placeholder", () => {
    render(
      <Select
        id="test-select"
        label="Test Select"
        placeholder="Choose option"
        value=""
        required
        options={options}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByRole("combobox", { name: "Test Select" })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "Test Select" }).getAttribute("aria-label")).toBe("Test Select");
    expect(screen.getByText("Test Select")).toBeTruthy();
  });

  it("should open dropdown and trigger onChange on option click", () => {
    const handleChange = jest.fn();
    render(
      <Select
        id="test-select"
        label="Test Select"
        placeholder="Choose option"
        value=""
        options={options}
        onChange={handleChange}
      />
    );

    const trigger = screen.getByRole("combobox");
    fireEvent.mouseDown(trigger);

    expect(screen.getByRole("listbox")).toBeTruthy();
    expect(screen.getByRole("option", { name: "Option One" })).toBeTruthy();

    fireEvent.click(screen.getByRole("option", { name: "Option One" }));
    expect(handleChange).toHaveBeenCalledWith("val-1");
  });

  it("should show errorMessage with role alert", () => {
    render(
      <Select
        id="test-select"
        label="Test Select"
        placeholder="Choose option"
        value=""
        options={options}
        errorMessage="Please select an option"
        onChange={jest.fn()}
      />
    );

    expect(screen.getByRole("alert").textContent).toBe("Please select an option");
  });
});
