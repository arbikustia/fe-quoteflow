import { fireEvent, render, screen } from "@testing-library/react";

import { SwitchComponent } from "./Switch.component";

it("should call onChange with checked state", (): void => {
  const onChange = jest.fn();
  render(<SwitchComponent label="Customer status" checked={false} onChange={onChange} />);

  fireEvent.click(screen.getByRole("switch", { name: "Customer status" }));
  expect(onChange).toHaveBeenCalledWith(true, expect.anything());
});

it("should preserve disabled state", (): void => {
  render(<SwitchComponent label="Customer status" checked disabled onChange={jest.fn()} />);

  expect(screen.getByRole("switch", { name: "Customer status" })).toBeDisabled();
});
