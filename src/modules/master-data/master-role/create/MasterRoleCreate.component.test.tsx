import { fireEvent, render, screen } from "@/libs/unit-test";

import { ROLE_FORM_DEFAULT_VALUES } from "./MasterRoleCreate.config";
import MasterRoleCreateComponent from "./MasterRoleCreate.component";
import type { MasterRoleCreateProps } from "./MasterRoleCreate.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

/**
 * Build form view props.
 * @param {Partial<MasterRoleCreateProps>} [overrides] - Props to override
 * @returns {MasterRoleCreateProps} - Component props
 */
const createProps = (overrides?: Partial<MasterRoleCreateProps>): MasterRoleCreateProps => ({
  mode: "create",
  formStatus: "ready",
  values: ROLE_FORM_DEFAULT_VALUES,
  fieldErrors: {},
  isSubmitting: false,
  onNameChange: jest.fn(),
  onStatusChange: jest.fn(),
  onSubmit: jest.fn(),
  onBack: jest.fn(),
  ...overrides,
});

describe("MasterRoleCreateComponent", () => {
  it("should render the create form without the status field", () => {
    const props = createProps();

    render(<MasterRoleCreateComponent {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getAllByText("New Role")).toHaveLength(3);
    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
    expect(props.onBack).toHaveBeenCalledTimes(1);
  });

  it("should forward input and submit events", () => {
    const props = createProps();

    render(<MasterRoleCreateComponent {...props} />);
    fireEvent.change(screen.getByPlaceholderText("e.g. Administrator"), { target: { value: "Administrator" } });
    fireEvent.submit(screen.getByRole("button", { name: "Create Role" }));

    expect(props.onNameChange).toHaveBeenCalledTimes(1);
    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });

  it("should show field errors", () => {
    render(<MasterRoleCreateComponent {...createProps({ fieldErrors: { name: "Role name is required." } })} />);

    expect(screen.getByText("Role name is required.")).toBeInTheDocument();
  });

  it("should show the status badge and switch in edit mode", () => {
    const props = createProps({ mode: "edit", values: { ...ROLE_FORM_DEFAULT_VALUES, isActive: false }, isSubmitting: true });

    render(<MasterRoleCreateComponent {...props} />);
    fireEvent.click(screen.getByRole("switch", { name: "Role status" }));

    expect(screen.getByText("inactive")).toHaveClass("bg-danger-subtle");
    expect(screen.getByRole("button", { name: "Updating…" })).toBeDisabled();
    expect(props.onStatusChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("should show the error message instead of the form", () => {
    render(<MasterRoleCreateComponent {...createProps({ mode: "edit", formStatus: "error" })} />);

    expect(screen.getByText("Unable to load role data. Please try again.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Update Role" })).not.toBeInTheDocument();
  });

  it("should show the submit error toast", () => {
    render(<MasterRoleCreateComponent {...createProps({ errorMessage: "Duplicate name" })} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Duplicate name");
  });
});
