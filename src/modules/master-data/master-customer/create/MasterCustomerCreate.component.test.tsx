import { fireEvent, render, screen } from "@/libs/unit-test";

import MasterCustomerCreateComponent from "./MasterCustomerCreate.component";
import type { MasterCustomerCreateProps } from "./MasterCustomerCreate.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

/**
 * Build form view props.
 * @param {Partial<MasterCustomerCreateProps>} [overrides] - Props to override
 * @returns {MasterCustomerCreateProps} - Component props
 */
const createProps = (overrides?: Partial<MasterCustomerCreateProps>): MasterCustomerCreateProps => ({
  mode: "create",
  formStatus: "ready",
  values: { name: "", email: "", phoneNumber: "", address: "", isActive: true },
  fieldErrors: {},
  isSubmitting: false,
  onNameChange: jest.fn(),
  onEmailChange: jest.fn(),
  onPhoneNumberChange: jest.fn(),
  onAddressChange: jest.fn(),
  onStatusChange: jest.fn(),
  onSubmit: jest.fn(),
  onBack: jest.fn(),
  ...overrides,
});

describe("MasterCustomerCreateComponent", () => {
  it("should render all required fields and the create actions", () => {
    const props = createProps();

    render(<MasterCustomerCreateComponent {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getAllByText("New Customer")).toHaveLength(3);
    expect(screen.getAllByText("*")).toHaveLength(4);
    expect(screen.queryByText("Status")).not.toBeInTheDocument();
    expect(props.onBack).toHaveBeenCalledTimes(1);
  });

  it("should configure the phone input for digits only", () => {
    render(<MasterCustomerCreateComponent {...createProps()} />);

    const phoneInput = screen.getByPlaceholderText("0812... or 628...");

    expect(phoneInput).toHaveAttribute("type", "tel");
    expect(phoneInput).toHaveAttribute("inputmode", "numeric");
    expect(phoneInput).toHaveAttribute("pattern", "[0-9]{6,15}");
  });

  it("should forward input changes and submit", () => {
    const props = createProps();

    render(<MasterCustomerCreateComponent {...props} />);
    fireEvent.change(screen.getByPlaceholderText("e.g. PT Mega Jaya Abadi"), { target: { value: "A" } });
    fireEvent.change(screen.getByPlaceholderText("e.g. customer@example.com"), { target: { value: "a@b.co" } });
    fireEvent.change(screen.getByPlaceholderText("0812... or 628..."), { target: { value: "0812" } });
    fireEvent.change(screen.getByPlaceholderText("e.g. Jl. Sudirman No. 45"), { target: { value: "X" } });
    fireEvent.submit(screen.getByRole("button", { name: "Create Customer" }));

    expect(props.onNameChange).toHaveBeenCalledTimes(1);
    expect(props.onEmailChange).toHaveBeenCalledTimes(1);
    expect(props.onPhoneNumberChange).toHaveBeenCalledTimes(1);
    expect(props.onAddressChange).toHaveBeenCalledTimes(1);
    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });

  it("should show field errors with danger borders", () => {
    render(<MasterCustomerCreateComponent {...createProps({ fieldErrors: { name: "Customer name is required.", address: "Address is required." } })} />);

    expect(screen.getByText("Customer name is required.")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g. Jl. Sudirman No. 45")).toHaveClass("border-danger");
  });

  it("should show the status switch and update copy in edit mode", () => {
    const props = createProps({ mode: "edit", isSubmitting: true });

    render(<MasterCustomerCreateComponent {...props} />);
    fireEvent.click(screen.getByRole("switch"));

    expect(screen.getByRole("button", { name: "Updating…" })).toBeDisabled();
    expect(props.onStatusChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it.each([
    ["loading", "Loading customer data…"],
    ["error", "Unable to load customer data. Please try again."],
  ] as const)("should show the %s message instead of the form", (formStatus, message) => {
    render(<MasterCustomerCreateComponent {...createProps({ mode: "edit", formStatus })} />);

    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Update Customer" })).not.toBeInTheDocument();
  });

  it("should show the submit error toast", () => {
    render(<MasterCustomerCreateComponent {...createProps({ errorMessage: "Duplicate customer" })} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Duplicate customer");
  });
});
