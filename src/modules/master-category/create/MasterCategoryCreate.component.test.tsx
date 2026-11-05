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
    const props = createProps();
    const { container } = render(<MasterCategoryCreateForm {...props} />);

    expect(screen.getByText("Category Name")).toBeTruthy();
    expect(screen.getByRole("navigation", { name: "Breadcrumb" }).textContent).toBe(
      "Master/Master Category/New Category",
    );
    expect(screen.getAllByText("New Category")).toHaveLength(3);
    expect(screen.getAllByText("Fill in the category details below.")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Create Category" })).toBeTruthy();

    const form = container.querySelector("form");
    expect(form?.classList.contains("rounded-3xl")).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(props.goBack).toHaveBeenCalledTimes(1);
  });

  it("should render status badge and update button in edit mode", () => {
    const { rerender } = render(
      <MasterCategoryCreateForm {...createProps({ isEditMode: true })} />,
    );

    expect(screen.getAllByText("Edit Category").length).toBeGreaterThan(0);
    expect(screen.getByText("active")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Update Category" })).toBeTruthy();

    rerender(
      <MasterCategoryCreateForm
        {...createProps({ isEditMode: true, isActive: false })}
      />,
    );

    expect(screen.getByText("inactive")).toBeTruthy();
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
