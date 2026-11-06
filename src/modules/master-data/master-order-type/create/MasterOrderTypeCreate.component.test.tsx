import { describe, expect, it, jest } from "@jest/globals";

import { fireEvent, render, screen } from "@/libs/unit-test";

import { MasterOrderTypeCreateForm } from "./MasterOrderTypeCreate.component";
import type { MasterOrderTypeCreateFormState } from "./MasterOrderTypeCreate.type";

const createProps = (): MasterOrderTypeCreateFormState => ({
  name: "",
  isHandover: false,
  isActive: true,
  isEditMode: false,
  handleHandoverChange: jest.fn(),
  handleStatusChange: jest.fn(),
  isLoadingInitialData: false,
  isSubmitting: false,
  errorMessage: null,
  successMessage: null,
  errors: {},
  isSubmitted: false,
  handleNameChange: jest.fn(),
  handleSubmit: jest.fn(),
  goBack: jest.fn(),
});

describe("MasterOrderTypeCreateForm", () => {
  it("should render all required order type fields", () => {
    render(<MasterOrderTypeCreateForm {...createProps()} />);

    expect(screen.getByText("Order Type Name")).toBeTruthy();
    expect(screen.getByText("Require Handover")).toBeTruthy();
    expect(screen.queryByText("Status")).toBeNull();
    expect(screen.getByRole("button", { name: "Create Order Type" })).toBeTruthy();
  });

  it("should match list title typography on mobile and desktop", () => {
    const { container } = render(<MasterOrderTypeCreateForm {...createProps()} />);
    const titles = container.querySelectorAll("h2");

    expect(titles).toHaveLength(2);
    titles.forEach((title) => {
      expect(title.classList.contains("text-4xl")).toBe(true);
      expect(title.classList.contains("font-semibold")).toBe(true);
      expect(title.classList.contains("tracking-tight")).toBe(true);
    });
  });

  it("should submit form using provided handler", () => {
    const props = createProps();
    render(<MasterOrderTypeCreateForm {...props} />);

    fireEvent.submit(screen.getByRole("button", { name: "Create Order Type" }).closest("form")!);

    expect(props.handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("should show submitting and error states", () => {
    const props = { ...createProps(), isSubmitting: true, errorMessage: "Error saving order type" };
    render(<MasterOrderTypeCreateForm {...props} />);

    expect(screen.getByText("Creating…")).toBeTruthy();
    expect(screen.getByText("Error saving order type")).toBeTruthy();
  });

  it("should render status toggle in edit mode", () => {
    const props = { ...createProps(), isEditMode: true };
    render(<MasterOrderTypeCreateForm {...props} />);

    expect(screen.getByText("Status")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Update Order Type" })).toBeTruthy();
  });
});
