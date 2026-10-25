import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@/libs/unit-test";

import { MasterVoucherCreateComponent } from "./MasterVoucherCreate.component";
import type { MasterVoucherCreateFormState } from "./MasterVoucherCreate.type";

const createProps = (overrides: Partial<MasterVoucherCreateFormState> = {}): MasterVoucherCreateFormState => ({
  name: "",
  code: "VOUCHER1",
  codeMode: "generate",
  discountPercent: "10",
  isActive: true,
  isEditMode: false,
  isSubmitting: false,
  errorMessage: null,
  errors: {},
  isSubmitted: false,
  handleNameChange: jest.fn(),
  handleCodeChange: jest.fn(),
  handleCodeModeChange: jest.fn(),
  handleDiscountChange: jest.fn(),
  handleStatusChange: jest.fn(),
  handleSubmit: jest.fn(async (): Promise<void> => Promise.resolve()),
  goBack: jest.fn(),
  ...overrides,
});

describe("MasterVoucherCreateComponent", () => {
  it("should render required voucher fields and custom novalidate form", () => {
    const props = createProps();
    render(<MasterVoucherCreateComponent {...props} />);

    const nameInput = screen.getByLabelText(/voucher name/i);
    const form = nameInput.closest("form");

    expect(nameInput).toBeTruthy();
    expect(form?.hasAttribute("novalidate")).toBe(true);

    if (form) {
      fireEvent.submit(form);
    }

    expect(props.handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("should render validation errors when submitted invalid", () => {
    render(<MasterVoucherCreateComponent {...createProps({
      isSubmitted: true,
      errors: {
        name: { type: "required", message: "Voucher name is required." },
        discountPercent: { type: "validate", message: "Discount must be between 0 and 100." },
      },
    })} />);

    expect(screen.getByText("Voucher name is required.")).toBeTruthy();
    expect(screen.getByText("Discount must be between 0 and 100.")).toBeTruthy();
  });

  it("should render custom voucher code input when codeMode is type", () => {
    const props = createProps({ codeMode: "type", code: "PROMO20" });
    render(<MasterVoucherCreateComponent {...props} />);

    const codeInput = screen.getByLabelText(/voucher code/i);
    expect(codeInput).toBeTruthy();
  });

  it("should render status switch in edit mode", () => {
    const props = createProps({ isEditMode: true });
    render(<MasterVoucherCreateComponent {...props} />);

    fireEvent.click(screen.getByRole("switch", { name: "Voucher status" }));
    expect(props.handleStatusChange).toHaveBeenCalledTimes(1);
  });
});
