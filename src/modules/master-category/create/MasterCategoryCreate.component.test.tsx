import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@/libs/unit-test";

import { MasterCategoryCreateForm } from "./MasterCategoryCreate.component";
import type { MasterCategoryCreateFormState } from "./MasterCategoryCreate.type";

const createProps = (overrides?: Partial<MasterCategoryCreateFormState>): MasterCategoryCreateFormState => ({
  name: "",
  isActive: true,
  isEditMode: false,
  isLoadingInitialData: false,
  isSubmitting: false,
  errorMessage: null,
  successMessage: null,
  errors: {},
  isSubmitted: false,
  handleNameChange: jest.fn(),
  handleStatusChange: jest.fn(),
  handleSubmit: jest.fn(),
  goBack: jest.fn(),
  ...overrides,
});

describe("MasterCategoryCreateForm", () => {
  it("should render category name input and create button in create mode", () => {
    render(<MasterCategoryCreateForm {...createProps()} />);

    expect(screen.getByText("Category Name")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Create Category" })).toBeTruthy();
  });

  it("should render update button in edit mode", () => {
    render(<MasterCategoryCreateForm {...createProps({ isEditMode: true })} />);

    expect(screen.getAllByText("Edit Category").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Update Category" })).toBeTruthy();
  });

  it("should submit form using provided handler", () => {
    const props = createProps();
    render(<MasterCategoryCreateForm {...props} />);

    const button = screen.getByRole("button", { name: "Create Category" });
    const form = button.closest("form");

    if (form) {
      fireEvent.submit(form);
    }

    expect(props.handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("should show submitting and error states", () => {
    render(<MasterCategoryCreateForm {...createProps({ isSubmitting: true, errorMessage: "Duplicate category" })} />);

    expect(screen.getByRole("button", { name: "Creating…" }).hasAttribute("disabled")).toBe(true);
    expect(screen.getByRole("alert").textContent).toBe("Duplicate category");
  });
});
