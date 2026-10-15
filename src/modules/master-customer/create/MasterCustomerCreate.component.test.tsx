import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

import { MasterCustomerCreateForm } from "./MasterCustomerCreate.component";
import type { MasterCustomerCreateFormState } from "./MasterCustomerCreate.type";

const createProps = (): MasterCustomerCreateFormState => ({
  name: "",
  address: "",
  phoneNumber: "",
  isSubmitting: false,
  errorMessage: null,
  successMessage: null,
  handleNameChange: jest.fn(),
  handlePhoneNumberChange: jest.fn(),
  handleAddressChange: jest.fn(),
  handleSubmit: jest.fn(),
  goBack: jest.fn(),
});

describe("MasterCustomerCreateForm", () => {
  it("should render all required customer fields", () => {
    render(<MasterCustomerCreateForm {...createProps()} />);

    expect(screen.getByText("Customer Name")).toBeTruthy();
    expect(screen.getByText("Phone Number")).toBeTruthy();
    expect(screen.getByText("Address")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Create Customer" })).toBeTruthy();
  });

  it("should submit form using provided handler", () => {
    const props = createProps();
    render(<MasterCustomerCreateForm {...props} />);

    fireEvent.submit(screen.getByRole("button", { name: "Create Customer" }).closest("form")!);

    expect(props.handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("should show submitting and error states", () => {
    render(<MasterCustomerCreateForm {...createProps()} isSubmitting errorMessage="Duplicate customer" />);

    expect(screen.getByRole("button", { name: "Creating…" }).hasAttribute("disabled")).toBe(true);
    expect(screen.getByRole("alert").textContent).toBe("Duplicate customer");
  });
});
