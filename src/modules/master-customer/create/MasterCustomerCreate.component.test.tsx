import { describe, expect, it, jest } from "@jest/globals";

import { fireEvent, render, screen } from "@/libs/unit-test";

import { MasterCustomerCreateForm } from "./MasterCustomerCreate.component";
import type { MasterCustomerCreateFormState } from "./MasterCustomerCreate.type";

const createProps = (): MasterCustomerCreateFormState => ({
  name: "",
  email: "",
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
  handleEmailChange: jest.fn(),
  handlePhoneNumberChange: jest.fn(),
  handleAddressChange: jest.fn(),
  handleSubmit: jest.fn(),
  goBack: jest.fn(),
});

describe("MasterCustomerCreateForm", () => {
  it("should render all required customer fields", () => {
    const props = createProps();
    const { container } = render(<MasterCustomerCreateForm {...props} />);

    expect(screen.getByText("Customer Name")).toBeTruthy();
    expect(screen.getByText("Email")).toBeTruthy();
    expect(screen.getByText("Phone Number")).toBeTruthy();
    expect(screen.getByText("Address")).toBeTruthy();
    expect(screen.getAllByText("*")).toHaveLength(4);
    expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Create Customer" })).toBeTruthy();

    const form = container.querySelector("form");
    expect(form?.classList.contains("rounded-3xl")).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(props.goBack).toHaveBeenCalledTimes(1);
  });

  it("should match customer list title typography on mobile and desktop", () => {
    const { container } = render(<MasterCustomerCreateForm {...createProps()} />);
    const titles = container.querySelectorAll("h2");

    expect(titles).toHaveLength(2);
    titles.forEach((title) => {
      expect(title.classList.contains("text-4xl")).toBe(true);
      expect(title.classList.contains("font-semibold")).toBe(true);
      expect(title.classList.contains("tracking-tight")).toBe(true);
    });
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

  it("should show success toast after customer creation", () => {
    render(<MasterCustomerCreateForm {...createProps()} successMessage="Customer created successfully." />);

    expect(screen.getByRole("alert").textContent).toContain("Customer created successfully.");
    expect(screen.getByRole("alert").parentElement?.classList.contains("fixed")).toBe(true);
    expect(screen.getByRole("alert").parentElement?.classList.contains("right-4")).toBe(true);
    expect(screen.getByRole("alert").parentElement?.classList.contains("top-4")).toBe(true);
  });
});
