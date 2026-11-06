import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@/libs/unit-test";

import { MasterPaymentTypeCreateForm } from "./MasterPaymentTypeCreate.component";
import type { MasterPaymentTypeCreateFormState } from "./MasterPaymentTypeCreate.type";

const createProps = (overrides: Partial<MasterPaymentTypeCreateFormState> = {}): MasterPaymentTypeCreateFormState => ({
  name: "",
  isActive: true,
  isEditMode: false,
  isLoadingInitialData: false,
  isSubmitting: false,
  errorMessage: null,
  successMessage: null,
  errors: {},
  isSubmitted: false,
  handleNameChange: jest.fn(),
  handleStatusChange: jest.fn(),
  handleSubmit: jest.fn(async (): Promise<void> => Promise.resolve()),
  goBack: jest.fn(),
  ...overrides,
});

describe("MasterPaymentTypeCreateForm", () => {
  it("should render required name field and custom validation form", () => {
    const props = createProps();
    render(<MasterPaymentTypeCreateForm {...props} />);

    const input = screen.getByLabelText(/payment type name/i);
    const form = input.closest("form");

    expect(input).toBeTruthy();
    expect(form?.hasAttribute("novalidate")).toBe(true);

    if (form) {
      fireEvent.submit(form);
    }

    expect(props.handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("should render validation error", () => {
    render(<MasterPaymentTypeCreateForm {...createProps({
      isSubmitted: true,
      errors: { name: { type: "required", message: "Payment type name is required." } },
    })} />);

    expect(screen.getByText("Payment type name is required.")).toBeTruthy();
  });

  it("should render status switch in edit mode", () => {
    const props = createProps({ isEditMode: true });
    render(<MasterPaymentTypeCreateForm {...props} />);

    fireEvent.click(screen.getByRole("switch", { name: "Payment type status" }));
    expect(props.handleStatusChange).toHaveBeenCalledTimes(1);
  });
});
