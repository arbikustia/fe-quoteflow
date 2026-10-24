import { fireEvent, render, screen } from "@testing-library/react";

import { CheckboxComponent } from "./Checkbox.component";

it("should render label and emit checked state", (): void => {
  const onChange = jest.fn();
  render(<CheckboxComponent label="Remember me" checked={false} onChange={onChange} />);

  fireEvent.click(screen.getByRole("checkbox", { name: "Remember me" }));
  expect(onChange).toHaveBeenCalledWith(true);
});

it("should preserve disabled and indeterminate states", (): void => {
  render(<CheckboxComponent ariaLabel="Select all" checked={false} indeterminate disabled onChange={jest.fn()} />);

  expect(screen.getByRole("checkbox", { name: "Select all" })).toBeDisabled();
  expect(screen.getByRole("checkbox", { name: "Select all" })).toHaveClass("ant-checkbox-input");
  expect(screen.getByRole("checkbox", { name: "Select all" }).parentElement).toHaveClass("ant-checkbox-indeterminate");
});
