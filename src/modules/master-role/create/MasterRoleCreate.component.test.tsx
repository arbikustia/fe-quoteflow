import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@/libs/unit-test";

import { MasterRoleCreateComponent } from "./MasterRoleCreate.component";
import type { MasterRoleCreateFormState } from "./MasterRoleCreate.type";

const createProps = (
  overrides: Partial<MasterRoleCreateFormState> = {},
): MasterRoleCreateFormState => ({
  roleName: "",
  isActive: true,
  isEditMode: false,
  isSubmitting: false,
  errorMessage: null,
  errors: {},
  isSubmitted: false,
  handleRoleNameChange: jest.fn(),
  handleStatusChange: jest.fn(),
  handleSubmit: jest.fn(async () => Promise.resolve()),
  goBack: jest.fn(),
  ...overrides,
});

describe("MasterRoleCreateComponent", () => {
  it("should render create form and forward interactions", () => {
    const props = createProps();
    render(<MasterRoleCreateComponent {...props} />);

    expect(screen.getAllByRole("heading", { name: "New Role" })[0]).toBeTruthy();
    expect(screen.queryByRole("switch")).toBeNull();

    fireEvent.change(screen.getByLabelText(/Role Name/), { target: { value: "Manager" } });
    fireEvent.click(screen.getAllByRole("button", { name: "Back" })[0]);
    const form = screen.getByRole("button", { name: "Create Role" }).closest("form");
    if (form) {
      fireEvent.submit(form);
    }

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
      errors: { roleName: { type: "required", message: "Role name is required." } },
    });
    render(<MasterRoleCreateComponent {...props} />);

    expect(screen.getAllByRole("heading", { name: "Edit Role" })[0]).toBeTruthy();
    expect(screen.getByDisplayValue("Administrator")).toBeTruthy();
    expect(screen.getByText("Role already exists.")).toBeTruthy();
    expect(screen.getByText("Role name is required.")).toBeTruthy();

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
    expect(submitButton.hasAttribute("disabled")).toBe(true);
  });
});
