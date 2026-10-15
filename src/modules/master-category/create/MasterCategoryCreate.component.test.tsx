import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

import { MasterCategoryCreateForm } from "./MasterCategoryCreate.component";
import type { MasterCategoryCreateFormState } from "./MasterCategoryCreate.type";

const createProps = (): MasterCategoryCreateFormState => ({
  name: "",
  isSubmitting: false,
  errorMessage: null,
  successMessage: null,
  handleNameChange: jest.fn(),
  handleSubmit: jest.fn(),
  goBack: jest.fn(),
});

describe("MasterCategoryCreateForm", () => {
  it("should render category name input", () => {
    render(<MasterCategoryCreateForm {...createProps()} />);

    expect(screen.getByText("Category Name")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Create Category" })).toBeTruthy();
  });

  it("should submit form using provided handler", () => {
    const props = createProps();
    render(<MasterCategoryCreateForm {...props} />);

    fireEvent.submit(screen.getByRole("button", { name: "Create Category" }).closest("form")!);

    expect(props.handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("should show submitting and error states", () => {
    render(<MasterCategoryCreateForm {...createProps()} isSubmitting errorMessage="Duplicate category" />);

    expect(screen.getByRole("button", { name: "Creating…" }).hasAttribute("disabled")).toBe(true);
    expect(screen.getByRole("alert").textContent).toBe("Duplicate category");
  });
});
