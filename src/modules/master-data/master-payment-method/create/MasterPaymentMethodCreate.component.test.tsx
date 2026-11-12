import { fireEvent, render, screen } from "@/libs/unit-test";

import { PAYMENT_METHOD_FORM_DEFAULT_VALUES } from "./MasterPaymentMethodCreate.config";
import MasterPaymentMethodCreateComponent from "./MasterPaymentMethodCreate.component";
import type { MasterPaymentMethodCreateProps } from "./MasterPaymentMethodCreate.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

/**
 * Build form view props.
 * @param {Partial<MasterPaymentMethodCreateProps>} [overrides] - Props to override
 * @returns {MasterPaymentMethodCreateProps} - Component props
 */
const createProps = (overrides?: Partial<MasterPaymentMethodCreateProps>): MasterPaymentMethodCreateProps => ({
  mode: "create",
  formStatus: "ready",
  values: PAYMENT_METHOD_FORM_DEFAULT_VALUES,
  fieldErrors: {},
  isSubmitting: false,
  onNameChange: jest.fn(),
  onDescriptionChange: jest.fn(),
  onStatusChange: jest.fn(),
  onSubmit: jest.fn(),
  onBack: jest.fn(),
  ...overrides,
});

describe("MasterPaymentMethodCreateComponent", () => {
  it("should render the create form without the status field", () => {
    const props = createProps();

    render(<MasterPaymentMethodCreateComponent {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getAllByText("New Payment Method")).toHaveLength(3);
    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
    expect(props.onBack).toHaveBeenCalledTimes(1);
  });

  it("should forward input, textarea and submit events", () => {
    const props = createProps();

    render(<MasterPaymentMethodCreateComponent {...props} />);
    fireEvent.change(screen.getByPlaceholderText("e.g. Bank Transfer"), { target: { value: "BCA" } });
    fireEvent.change(screen.getByPlaceholderText("Describe this payment method"), { target: { value: "No Admin Fee" } });
    fireEvent.submit(screen.getByRole("button", { name: "Create Payment Method" }));

    expect(props.onNameChange).toHaveBeenCalledTimes(1);
    expect(props.onDescriptionChange).toHaveBeenCalledTimes(1);
    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });

  it("should show field errors", () => {
    render(<MasterPaymentMethodCreateComponent {...createProps({ fieldErrors: { name: "Payment method name is required.", description: "Description is required." } })} />);

    expect(screen.getByText("Payment method name is required.")).toBeInTheDocument();
    expect(screen.getByText("Description is required.")).toBeInTheDocument();
  });

  it("should show the status badge and switch in edit mode", () => {
    const props = createProps({ mode: "edit", values: { ...PAYMENT_METHOD_FORM_DEFAULT_VALUES, isActive: false }, isSubmitting: true });

    render(<MasterPaymentMethodCreateComponent {...props} />);
    fireEvent.click(screen.getByRole("switch", { name: "Payment method status" }));

    expect(screen.getByText("inactive")).toHaveClass("bg-danger-subtle");
    expect(screen.getByRole("button", { name: "Updating…" })).toBeDisabled();
    expect(props.onStatusChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("should show the error message instead of the form", () => {
    render(<MasterPaymentMethodCreateComponent {...createProps({ mode: "edit", formStatus: "error" })} />);

    expect(screen.getByText("Payment method data is unavailable. Open the payment method from the payment method list to edit it.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Update Payment Method" })).not.toBeInTheDocument();
  });

  it("should show the submit error toast", () => {
    render(<MasterPaymentMethodCreateComponent {...createProps({ errorMessage: "Duplicate name" })} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Duplicate name");
  });
});
