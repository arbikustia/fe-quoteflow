import { fireEvent, render, screen } from "@/libs/unit-test";

import { PIC_FORM_DEFAULT_VALUES } from "./MasterPicCreate.config";
import MasterPicCreateComponent from "./MasterPicCreate.component";
import type { MasterPicCreateProps } from "./MasterPicCreate.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

/**
 * Build form view props.
 * @param {Partial<MasterPicCreateProps>} [overrides] - Props to override
 * @returns {MasterPicCreateProps} - Component props
 */
const createProps = (overrides?: Partial<MasterPicCreateProps>): MasterPicCreateProps => ({
  mode: "create",
  formStatus: "ready",
  values: PIC_FORM_DEFAULT_VALUES,
  fieldErrors: {},
  isSubmitting: false,
  onNameChange: jest.fn(),
  onStatusChange: jest.fn(),
  onSubmit: jest.fn(),
  onBack: jest.fn(),
  ...overrides,
});

describe("MasterPicCreateComponent", () => {
  it("should render the create form without the status field", () => {
    const props = createProps();

    render(<MasterPicCreateComponent {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getAllByText("New PIC")).toHaveLength(3);
    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
    expect(props.onBack).toHaveBeenCalledTimes(1);
  });

  it("should forward input and submit events", () => {
    const props = createProps();

    render(<MasterPicCreateComponent {...props} />);
    fireEvent.change(screen.getByPlaceholderText("e.g. John Doe"), { target: { value: "Aurora" } });
    fireEvent.submit(screen.getByRole("button", { name: "Create PIC" }));

    expect(props.onNameChange).toHaveBeenCalledTimes(1);
    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });

  it("should show the name error", () => {
    render(<MasterPicCreateComponent {...createProps({ fieldErrors: { name: "PIC name is required." } })} />);

    expect(screen.getByText("PIC name is required.")).toBeInTheDocument();
  });

  it("should show the status badge and switch in edit mode", () => {
    const props = createProps({ mode: "edit", values: { ...PIC_FORM_DEFAULT_VALUES, isActive: false }, isSubmitting: true });

    render(<MasterPicCreateComponent {...props} />);
    fireEvent.click(screen.getByRole("switch", { name: "PIC status" }));

    expect(screen.getByText("inactive")).toHaveClass("bg-danger-subtle");
    expect(screen.getByRole("button", { name: "Updating…" })).toBeDisabled();
    expect(props.onStatusChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("should show the error message instead of the form", () => {
    render(<MasterPicCreateComponent {...createProps({ mode: "edit", formStatus: "error" })} />);

    expect(screen.getByText("PIC data is unavailable. Open the PIC from the PIC list to edit it.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Update PIC" })).not.toBeInTheDocument();
  });

  it("should show the submit error toast", () => {
    render(<MasterPicCreateComponent {...createProps({ errorMessage: "Duplicate name" })} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Duplicate name");
  });
});
