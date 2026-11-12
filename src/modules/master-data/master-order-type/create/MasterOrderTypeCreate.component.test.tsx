import { fireEvent, render, screen } from "@/libs/unit-test";

import { ORDER_TYPE_FORM_DEFAULT_VALUES } from "./MasterOrderTypeCreate.config";
import MasterOrderTypeCreateComponent from "./MasterOrderTypeCreate.component";
import type { MasterOrderTypeCreateProps } from "./MasterOrderTypeCreate.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

/**
 * Build form view props.
 * @param {Partial<MasterOrderTypeCreateProps>} [overrides] - Props to override
 * @returns {MasterOrderTypeCreateProps} - Component props
 */
const createProps = (overrides?: Partial<MasterOrderTypeCreateProps>): MasterOrderTypeCreateProps => ({
  mode: "create",
  formStatus: "ready",
  values: ORDER_TYPE_FORM_DEFAULT_VALUES,
  fieldErrors: {},
  isSubmitting: false,
  onNameChange: jest.fn(),
  onToggleChange: { isHandover: jest.fn(), isActive: jest.fn() },
  onSubmit: jest.fn(),
  onBack: jest.fn(),
  ...overrides,
});

describe("MasterOrderTypeCreateComponent", () => {
  it("should render the create form without the status field", () => {
    const props = createProps();

    render(<MasterOrderTypeCreateComponent {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getAllByText("New Order Type")).toHaveLength(3);
    expect(screen.getAllByRole("switch")).toHaveLength(1);
    expect(props.onBack).toHaveBeenCalledTimes(1);
  });

  it("should forward input, switch and submit events", () => {
    const props = createProps();

    render(<MasterOrderTypeCreateComponent {...props} />);
    fireEvent.change(screen.getByPlaceholderText("e.g. Rental, Project, or Sales"), { target: { value: "Delivery" } });
    fireEvent.click(screen.getByRole("switch", { name: "Handover required" }));
    fireEvent.submit(screen.getByRole("button", { name: "Create Order Type" }));

    expect(props.onNameChange).toHaveBeenCalledTimes(1);
    expect(props.onToggleChange.isHandover).toHaveBeenCalledWith(true, expect.anything());
    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });

  it("should show the name error", () => {
    render(<MasterOrderTypeCreateComponent {...createProps({ fieldErrors: { name: "Order type name is required." } })} />);

    expect(screen.getByText("Order type name is required.")).toBeInTheDocument();
  });

  it("should show the status badge and switch in edit mode", () => {
    const props = createProps({ mode: "edit", values: { ...ORDER_TYPE_FORM_DEFAULT_VALUES, isActive: false }, isSubmitting: true });

    render(<MasterOrderTypeCreateComponent {...props} />);
    fireEvent.click(screen.getByRole("switch", { name: "Order type status" }));

    expect(screen.getByText("inactive")).toHaveClass("bg-danger-subtle");
    expect(screen.getByRole("button", { name: "Updating…" })).toBeDisabled();
    expect(props.onToggleChange.isActive).toHaveBeenCalledWith(true, expect.anything());
  });

  it.each([
    ["loading", "Loading order type data…"],
    ["error", "Unable to load order type data. Please try again."],
  ] as const)("should show the %s message instead of the form", (formStatus, message) => {
    render(<MasterOrderTypeCreateComponent {...createProps({ mode: "edit", formStatus })} />);

    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Update Order Type" })).not.toBeInTheDocument();
  });

  it("should show the submit error toast", () => {
    render(<MasterOrderTypeCreateComponent {...createProps({ errorMessage: "Duplicate name" })} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Duplicate name");
  });
});
