import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";

import { MasterItemCreateForm } from "./MasterItemCreate.component";
import type { MasterItemCreateFormState } from "./MasterItemCreate.type";

const createProps = (overrides?: Partial<MasterItemCreateFormState>): MasterItemCreateFormState => ({
  name: "",
  categoryId: "",
  price: "",
  stock: "",
  image: "",
  duration: "",
  remark: "",
  isActive: true,
  isEditMode: false,
  isSubmitting: false,
  isCategoryLoading: false,
  categoryError: null,
  errorMessage: null,
  categories: [
    { id: "cat-1", category_name: "Audio System" },
    { id: "cat-2", category_name: "Lighting" },
  ],
  handleNameChange: jest.fn(),
  handleCategoryChange: jest.fn(),
  handlePriceChange: jest.fn(),
  handleStockChange: jest.fn(),
  handleImageChange: jest.fn(),
  handleDurationChange: jest.fn(),
  handleRemarkChange: jest.fn(),
  handleStatusChange: jest.fn(),
  handleSubmit: jest.fn(async () => {}),
  goBack: jest.fn(),
  ...overrides,
});

describe("MasterItemCreateForm", () => {
  it("should render item form fields and select options in create mode", () => {
    render(<MasterItemCreateForm {...createProps()} />);

    expect(screen.getByLabelText("Item name")).toBeTruthy();
    expect(screen.getByLabelText("Category")).toBeTruthy();
    expect(screen.getByRole("option", { name: "Audio System" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Create Item" })).toBeTruthy();
    expect(screen.queryByRole("switch")).toBeNull();
  });

  it("should render status switch and update button in edit mode", () => {
    render(<MasterItemCreateForm {...createProps({ isEditMode: true })} />);

    expect(screen.getByRole("switch")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Update Item" })).toBeTruthy();
  });

  it("should submit form through handleSubmit", () => {
    const props = createProps();
    render(<MasterItemCreateForm {...props} />);

    fireEvent.submit(screen.getByRole("button", { name: "Create Item" }).closest("form")!);

    expect(props.handleSubmit).toHaveBeenCalledTimes(1);
  });
});
