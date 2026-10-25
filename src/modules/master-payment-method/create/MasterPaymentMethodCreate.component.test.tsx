import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@/libs/unit-test";

import { MasterPaymentMethodCreateForm } from "./MasterPaymentMethodCreate.component";
import type { MasterPaymentMethodCreateFormState } from "./MasterPaymentMethodCreate.type";

const createProps = (
  overrides: Partial<MasterPaymentMethodCreateFormState> = {},
): MasterPaymentMethodCreateFormState => ({
  name: "",
  description: "",
  isActive: true,
  isEditMode: false,
  isLoadingInitialData: false,
  isSubmitting: false,
  errorMessage: null,
  successMessage: null,
  errors: {},
  isSubmitted: false,
  handleNameChange: jest.fn(),
  handleDescriptionChange: jest.fn(),
  handleStatusChange: jest.fn(),
  handleSubmit: jest.fn(async (): Promise<void> => Promise.resolve()),
  goBack: jest.fn(),
  ...overrides,
});

describe("MasterPaymentMethodCreateForm", () => {
  it("should render required fields and submit without native validation", () => {
    const props = createProps();
    render(<MasterPaymentMethodCreateForm {...props} />);

    const nameInput = screen.getByLabelText(/payment method name/i);
    const form = nameInput.closest("form");

    expect(screen.getByLabelText(/description/i)).toBeTruthy();
    expect(form?.hasAttribute("novalidate")).toBe(true);

    if (form) {
      fireEvent.submit(form);
    }

    expect(props.handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("should render required field errors", () => {
    render(<MasterPaymentMethodCreateForm {...createProps({
      isSubmitted: true,
      errors: {
        name: { type: "required", message: "Payment method name is required." },
        description: { type: "required", message: "Description is required." },
      },
    })} />);

    expect(screen.getByText("Payment method name is required.")).toBeTruthy();
    expect(screen.getByText("Description is required.")).toBeTruthy();
  });

  it("should render shared status switch in edit mode", () => {
    const props = createProps({ isEditMode: true });
    render(<MasterPaymentMethodCreateForm {...props} />);

    fireEvent.click(screen.getByRole("switch", { name: "Payment method status" }));
    expect(props.handleStatusChange).toHaveBeenCalledTimes(1);
  });
});
