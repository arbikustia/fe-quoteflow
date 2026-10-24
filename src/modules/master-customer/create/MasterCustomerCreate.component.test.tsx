import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

import { MasterCustomerCreateForm } from "./MasterCustomerCreate.component";
import type { MasterCustomerCreateFormState } from "./MasterCustomerCreate.type";

const createProps = (): MasterCustomerCreateFormState => ({
  name: "",
  address: "",
  phoneNumber: "",
  isActive: true,
  isEditMode: false,
  handleStatusChange: jest.fn(),
  isLoadingInitialData: false,
  isSubmitting: false,
  errorMessage: null,
  successMessage: null,
  errors: {},
  isSubmitted: false,
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
    expect(screen.getAllByText("*")).toHaveLength(3);
    expect(screen.getByRole("button", { name: "Create Customer" })).toBeTruthy();
  });

  it("should configure phone field with pattern and tel attributes", () => {
    render(<MasterCustomerCreateForm {...createProps()} />);

    const phoneInput = screen.getByPlaceholderText("0812... atau 628...");
    expect(phoneInput.getAttribute("type")).toBe("tel");
    expect(phoneInput.getAttribute("inputmode")).toBe("numeric");
    expect(phoneInput.getAttribute("pattern")).toBe("[0-9]{6,15}");
    expect(phoneInput.getAttribute("required")).toBe("");
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
