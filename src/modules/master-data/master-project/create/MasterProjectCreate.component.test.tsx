import { fireEvent, render, screen } from "@/libs/unit-test";

import { PROJECT_FORM_DEFAULT_VALUES } from "./MasterProjectCreate.config";
import MasterProjectCreateComponent from "./MasterProjectCreate.component";
import type { MasterProjectCreateProps, ProjectItemOption } from "./MasterProjectCreate.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const OPTION: ProjectItemOption = { id: "item-1", name: "Beam 290", image: "https://cdn.example.com/beam.jpg", price: 100000, stock: 11 };
const NO_IMAGE_OPTION: ProjectItemOption = { id: "item-2", name: "Wireless Mic", image: "", price: 0, stock: 0 };

/**
 * Build form view props.
 * @param {Partial<MasterProjectCreateProps>} [overrides] - Props to override
 * @returns {MasterProjectCreateProps} - Component props
 */
const createProps = (overrides?: Partial<MasterProjectCreateProps>): MasterProjectCreateProps => ({
  mode: "create",
  formStatus: "ready",
  itemsStatus: "ready",
  itemOptions: [OPTION, NO_IMAGE_OPTION],
  step: "items",
  values: PROJECT_FORM_DEFAULT_VALUES,
  fieldErrors: {},
  isSubmitting: false,
  onItemToggle: jest.fn(),
  onItemQuantityChange: jest.fn(),
  onNameChange: jest.fn(),
  onPriceChange: jest.fn(),
  onRemarkChange: jest.fn(),
  onStatusChange: jest.fn(),
  onSubmit: jest.fn(async (event) => {
    event.preventDefault();
  }),
  onStepBack: jest.fn(),
  onBack: jest.fn(),
  ...overrides,
});

describe("MasterProjectCreateComponent", () => {
  it("should render item options and toggle an item", () => {
    const props = createProps();

    render(<MasterProjectCreateComponent {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Select Beam 290" }));

    expect(screen.getByText("No image")).toBeInTheDocument();
    expect(props.onItemToggle).toHaveBeenCalledWith(OPTION);
  });

  it("should show the quantity input of a selected item and forward changes", () => {
    const props = createProps({ values: { ...PROJECT_FORM_DEFAULT_VALUES, selectedItems: [{ ...OPTION, qty: 2 }] } });

    render(<MasterProjectCreateComponent {...props} />);
    fireEvent.change(screen.getByLabelText("Qty"), { target: { value: "5" } });

    expect(props.onItemQuantityChange).toHaveBeenCalledWith("item-1", 5);
  });

  it("should render the item state message and selection error", () => {
    render(<MasterProjectCreateComponent {...createProps({ itemsStatus: "empty", itemOptions: [], fieldErrors: { selectedItems: "Select at least one item." } })} />);

    expect(screen.getByText("No items available.")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Select at least one item.");
  });

  it("should cancel from the first step and submit with Next", () => {
    const props = createProps();

    render(<MasterProjectCreateComponent {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    fireEvent.submit(screen.getByRole("button", { name: "Next" }));

    expect(props.onStepBack).toHaveBeenCalledTimes(1);
    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });

  it("should forward information inputs and hide the status switch in create mode", () => {
    const props = createProps({ step: "information", fieldErrors: { price: "Project price is required." } });

    render(<MasterProjectCreateComponent {...props} />);
    fireEvent.change(screen.getByPlaceholderText("e.g. Stage Sound Package"), { target: { value: "Wedding" } });
    fireEvent.change(screen.getByPlaceholderText("e.g. 5000000"), { target: { value: "5000" } });
    fireEvent.change(screen.getByLabelText("Remark"), { target: { value: "Note" } });

    expect(props.onNameChange).toHaveBeenCalledTimes(1);
    expect(props.onPriceChange).toHaveBeenCalledWith(5000);
    expect(props.onRemarkChange).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Project price is required.")).toBeInTheDocument();
    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
  });

  it("should send null when the price is cleared", () => {
    const props = createProps({ step: "information", values: { ...PROJECT_FORM_DEFAULT_VALUES, price: 5000 } });

    render(<MasterProjectCreateComponent {...props} />);
    fireEvent.change(screen.getByPlaceholderText("e.g. 5000000"), { target: { value: "" } });

    expect(props.onPriceChange).toHaveBeenCalledWith(null);
  });

  it("should show the status switch in edit mode", () => {
    const props = createProps({ mode: "edit", step: "information" });

    render(<MasterProjectCreateComponent {...props} />);
    fireEvent.click(screen.getByRole("switch"));

    expect(jest.mocked(props.onStatusChange).mock.calls[0][0]).toBe(false);
    expect(screen.getAllByText("Edit Project").length).toBeGreaterThan(0);
  });

  it("should render the preview and the save label per mode", () => {
    const values = { ...PROJECT_FORM_DEFAULT_VALUES, name: "Wedding", price: 5000, selectedItems: [{ ...OPTION, qty: 2 }] };

    const { rerender } = render(<MasterProjectCreateComponent {...createProps({ step: "preview", values })} />);

    expect(screen.getAllByText("Wedding").length).toBeGreaterThan(0);
    expect(screen.getByText("Qty: 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save Project" })).toBeInTheDocument();

    rerender(<MasterProjectCreateComponent {...createProps({ mode: "edit", step: "preview", values, isSubmitting: true })} />);
    expect(screen.getByRole("button", { name: "Updating…" })).toBeDisabled();
  });

  it("should render the form state message and error toast", () => {
    render(<MasterProjectCreateComponent {...createProps({ formStatus: "error", errorMessage: "Boom" })} />);

    expect(screen.getByText("Unable to load project data. Please try again.")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Boom");
  });
});
