import { fireEvent, render, screen } from "@/libs/unit-test";

import { USER_FORM_DEFAULT_VALUES } from "./MasterUserCreate.config";
import MasterUserCreateComponent from "./MasterUserCreate.component";
import type { MasterUserCreateProps } from "./MasterUserCreate.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

/**
 * Build form view props.
 * @param {Partial<MasterUserCreateProps>} [overrides] - Props to override
 * @returns {MasterUserCreateProps} - Component props
 */
const createProps = (overrides?: Partial<MasterUserCreateProps>): MasterUserCreateProps => ({
  mode: "create",
  formStatus: "ready",
  values: USER_FORM_DEFAULT_VALUES,
  fieldErrors: {},
  isSubmitting: false,
  isPasswordVisible: false,
  roleOptions: [{ label: "Administrator", value: "Administrator" }],
  isRoleOptionsLoading: false,
  onUsernameChange: jest.fn(),
  onEmailChange: jest.fn(),
  onPasswordChange: jest.fn(),
  onTogglePasswordVisibility: jest.fn(),
  onRoleChange: jest.fn(),
  onStatusChange: jest.fn(),
  onSubmit: jest.fn(),
  onBack: jest.fn(),
  ...overrides,
});

describe("MasterUserCreateComponent", () => {
  it("should render the create form without the status field", () => {
    const props = createProps();

    render(<MasterUserCreateComponent {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getAllByText("New User")).toHaveLength(3);
    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
    expect(props.onBack).toHaveBeenCalledTimes(1);
  });

  it("should forward input and submit events", () => {
    const props = createProps();

    render(<MasterUserCreateComponent {...props} />);
    fireEvent.change(screen.getByPlaceholderText("e.g. johndoe"), { target: { value: "johndoe" } });
    fireEvent.change(screen.getByPlaceholderText("e.g. john@example.com"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/^Password/), { target: { value: "secret" } });
    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    fireEvent.submit(screen.getByRole("button", { name: "Create User" }));

    expect(props.onUsernameChange).toHaveBeenCalledTimes(1);
    expect(props.onEmailChange).toHaveBeenCalledTimes(1);
    expect(props.onPasswordChange).toHaveBeenCalledTimes(1);
    expect(props.onTogglePasswordVisibility).toHaveBeenCalledTimes(1);
    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });

  it("should show field errors", () => {
    render(<MasterUserCreateComponent {...createProps({ fieldErrors: { username: "Username is required.", role: "Role is required." } })} />);

    expect(screen.getByText("Username is required.")).toBeInTheDocument();
    expect(screen.getByText("Role is required.")).toBeInTheDocument();
  });

  it("should show the visible password toggle and the role load error", () => {
    render(<MasterUserCreateComponent {...createProps({ isPasswordVisible: true, roleOptionsError: "Unable to load roles." })} />);

    expect(screen.getByRole("button", { name: "Hide password" })).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/)).toHaveAttribute("type", "text");
    expect(screen.getByText("Unable to load roles.")).toBeInTheDocument();
  });

  it("should hide the password field in edit mode", () => {
    render(<MasterUserCreateComponent {...createProps({ mode: "edit" })} />);

    expect(screen.queryByLabelText(/^Password/)).not.toBeInTheDocument();
  });

  it("should show the status badge and switch in edit mode", () => {
    const props = createProps({ mode: "edit", values: { ...USER_FORM_DEFAULT_VALUES, isActive: false }, isSubmitting: true });

    render(<MasterUserCreateComponent {...props} />);
    fireEvent.click(screen.getByRole("switch", { name: "User status" }));

    expect(screen.getByText("inactive")).toHaveClass("bg-danger-subtle");
    expect(screen.getByRole("button", { name: "Updating…" })).toBeDisabled();
    expect(props.onStatusChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("should show the error message instead of the form", () => {
    render(<MasterUserCreateComponent {...createProps({ mode: "edit", formStatus: "error" })} />);

    expect(screen.getByText("Unable to load user data. Please try again.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Update User" })).not.toBeInTheDocument();
  });

  it("should show the submit error toast", () => {
    render(<MasterUserCreateComponent {...createProps({ errorMessage: "Duplicate username" })} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Duplicate username");
  });
});
