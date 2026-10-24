import { fireEvent, render, screen } from "@testing-library/react";

import { InputComponent } from "./Input.component";

it("should associate text labels and preserve validation attributes", (): void => {
  const onChange = jest.fn();
  render(<InputComponent id="phone" label="Phone" type="tel" value="0812" required pattern="[0-9]+" onChange={onChange} />);
  const input = screen.getByRole("textbox", { name: /Phone/ });
  expect(input).toHaveValue("0812");
  expect(input).toBeRequired();
  fireEvent.change(input, { target: { value: "08123" } });
  expect(onChange).toHaveBeenCalledTimes(1);
});

it("should emit numeric values and null when cleared", (): void => {
  const onChange = jest.fn();
  const { rerender } = render(<InputComponent id="qty" label="Quantity" type="number" value={1} onChange={onChange} />);
  fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "2" } });
  expect(onChange).toHaveBeenLastCalledWith(2);
  rerender(<InputComponent id="qty" label="Quantity" type="number" value={2} onChange={onChange} />);
  fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "" } });
  expect(onChange).toHaveBeenLastCalledWith(null);
});

it("should associate textarea errors and preserve disabled state", (): void => {
  render(<InputComponent id="address" label="Address" type="textarea" value="" disabled errorMessage="Address required" onChange={jest.fn()} />);
  expect(screen.getByLabelText("Address")).toBeDisabled();
  expect(screen.getByLabelText("Address")).toHaveAttribute("aria-describedby", "address-error");
  expect(screen.getByRole("alert")).toHaveTextContent("Address required");
});

it("should select an option through Ant Design", (): void => {
  const onChange = jest.fn();
  render(<InputComponent id="status" label="Status" type="select" value="" options={[{ value: "active", label: "Active" }]} onChange={onChange} />);
  fireEvent.mouseDown(screen.getByRole("combobox"));
  fireEvent.click(screen.getByRole("option", { name: "Active" }));
  expect(onChange).toHaveBeenCalledWith("active", expect.anything());
});

it("should render the selected option and disabled state", (): void => {
  render(<InputComponent id="status" label="Status" type="select" value="active" disabled options={[{ value: "active", label: "Active" }]} onChange={jest.fn()} />);
  expect(screen.getByRole("combobox", { name: "Status" })).toBeDisabled();
  expect(screen.getByText("Active")).toBeInTheDocument();
});
