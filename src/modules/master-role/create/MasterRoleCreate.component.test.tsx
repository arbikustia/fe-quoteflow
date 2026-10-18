import { fireEvent, render, screen } from "@testing-library/react";

import { MasterRoleCreateComponent } from "./MasterRoleCreate.component";
import type { MasterRoleCreateFormState } from "../MasterRole.type";

const createProps = (
  overrides: Partial<MasterRoleCreateFormState> = {},
): MasterRoleCreateFormState => ({
  roleName: "",
  isActive: true,
  isEditMode: false,
  isSubmitting: false,
  errorMessage: null,
  handleRoleNameChange: jest.fn(),
  handleStatusChange: jest.fn(),
  handleSubmit: jest.fn(() => Promise.resolve()),
  goBack: jest.fn(),
  ...overrides,
});

describe("MasterRoleCreateComponent", () => {
  it("should render create form and forward interactions", () => {
    const props = createProps();
    render(<MasterRoleCreateComponent {...props} />);

    expect(screen.getByRole("heading", { name: "New Role" })).toBeInTheDocument();
    expect(screen.queryByRole("switch")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Role Name/), { target: { value: "Manager" } });
    fireEvent.click(screen.getAllByRole("button", { name: "Back" })[0]);
    fireEvent.submit(screen.getByRole("button", { name: "Create Role" }).closest("form")!);

    expect(props.handleRoleNameChange).toHaveBeenCalled();
    expect(props.goBack).toHaveBeenCalled();
    expect(props.handleSubmit).toHaveBeenCalled();
  });

  it("should render edit status and error state", () => {
    const props = createProps({
      roleName: "Administrator",
      isActive: false,
      isEditMode: true,
      errorMessage: "Role already exists.",
    });
    render(<MasterRoleCreateComponent {...props} />);

    expect(screen.getByRole("heading", { name: "Edit Role" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("Administrator")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Role already exists.");
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");

    fireEvent.click(screen.getByRole("switch"));
    expect(props.handleStatusChange).toHaveBeenCalled();
  });

  it("should disable submit action while submitting", () => {
    render(
      <MasterRoleCreateComponent
        {...createProps({ isEditMode: true, isSubmitting: true })}
      />,
    );

    const submitButton = screen.getByRole("button", { name: "Updating…" });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute("aria-busy", "true");
  });
});
