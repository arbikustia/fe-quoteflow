import { fireEvent, render, screen } from "@/libs/unit-test";

import MasterVoucherCreateComponent from "./MasterVoucherCreate.component";
import { VOUCHER_FORM_DEFAULT_VALUES } from "./MasterVoucherCreate.config";
import type { MasterVoucherCreateProps } from "./MasterVoucherCreate.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

/**
 * Build form view props.
 * @param {Partial<MasterVoucherCreateProps>} [overrides] - Props to override
 * @returns {MasterVoucherCreateProps} - Component props
 */
const createProps = (overrides?: Partial<MasterVoucherCreateProps>): MasterVoucherCreateProps => ({
  mode: "create",
  formStatus: "ready",
  values: VOUCHER_FORM_DEFAULT_VALUES,
  fieldErrors: {},
  isSubmitting: false,
  onNameChange: jest.fn(),
  onCodeModeChange: jest.fn(),
  onCodeChange: jest.fn(),
  onDiscountChange: jest.fn(),
  onStatusChange: jest.fn(),
  onSubmit: jest.fn(),
  onBack: jest.fn(),
  ...overrides,
});

describe("MasterVoucherCreateComponent", () => {
  it("should render the create form without the status field", () => {
    const props = createProps();

    render(<MasterVoucherCreateComponent {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getAllByText("New Voucher")).toHaveLength(3);
    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
    expect(props.onBack).toHaveBeenCalledTimes(1);
  });

  it("should forward name, discount and submit events and hide the code input when generating", () => {
    const props = createProps();

    render(<MasterVoucherCreateComponent {...props} />);
    fireEvent.change(screen.getByPlaceholderText("e.g. Summer Promo"), { target: { value: "Summer Promo" } });
    fireEvent.change(screen.getByPlaceholderText("e.g. 10"), { target: { value: "10" } });
    fireEvent.submit(screen.getByRole("button", { name: "Create Voucher" }));

    expect(props.onNameChange).toHaveBeenCalledTimes(1);
    expect(props.onDiscountChange).toHaveBeenCalledWith(10);
    expect(props.onSubmit).toHaveBeenCalledTimes(1);
    expect(screen.queryByPlaceholderText("Min 7, max 8 chars (alphanumeric)")).not.toBeInTheDocument();
  });

  it("should show the code input in type mode and forward its changes", () => {
    const props = createProps({ values: { ...VOUCHER_FORM_DEFAULT_VALUES, codeMode: "type" }, fieldErrors: { code: "Voucher code is required." } });

    render(<MasterVoucherCreateComponent {...props} />);
    fireEvent.change(screen.getByPlaceholderText("Min 7, max 8 chars (alphanumeric)"), { target: { value: "SLABC123" } });

    expect(props.onCodeChange).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Voucher code is required.")).toBeInTheDocument();
  });

  it("should show field errors", () => {
    render(<MasterVoucherCreateComponent {...createProps({ fieldErrors: { name: "Voucher name is required.", discountPercent: "Discount percentage is required." } })} />);

    expect(screen.getByText("Voucher name is required.")).toBeInTheDocument();
    expect(screen.getByText("Discount percentage is required.")).toBeInTheDocument();
  });

  it("should show the status badge and switch in edit mode", () => {
    const props = createProps({ mode: "edit", values: { ...VOUCHER_FORM_DEFAULT_VALUES, isActive: false }, isSubmitting: true });

    render(<MasterVoucherCreateComponent {...props} />);
    fireEvent.click(screen.getByRole("switch", { name: "Voucher status" }));

    expect(screen.getByText("inactive")).toHaveClass("bg-danger-subtle");
    expect(screen.getByRole("button", { name: "Updating…" })).toBeDisabled();
    expect(props.onStatusChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("should show the error message instead of the form", () => {
    render(<MasterVoucherCreateComponent {...createProps({ mode: "edit", formStatus: "error" })} />);

    expect(screen.getByText("Unable to load voucher data. Please try again.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Update Voucher" })).not.toBeInTheDocument();
  });

  it("should show the submit error toast", () => {
    render(<MasterVoucherCreateComponent {...createProps({ errorMessage: "Duplicate name" })} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Duplicate name");
  });
});
