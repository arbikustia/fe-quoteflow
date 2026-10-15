import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { MasterCategoryComponent } from "./MasterCategory.component";
import type { CategoryData, MasterCategoryProps } from "./MasterCategory.type";
import type { TableColumn } from "@/components/Table";

const mockCategories: readonly CategoryData[] = [
  { id: "1", categoryName: "Audio System", status: "active", createAt: "2024-02-01", createBy: "Admin" },
  { id: "2", categoryName: "Lighting", status: "inactive", createAt: "2024-03-01", createBy: "Admin" },
];

const mockColumns: readonly TableColumn<CategoryData>[] = [{ key: "categoryName", header: "Name" }];

const createProps = (overrides?: Partial<MasterCategoryProps>): MasterCategoryProps => ({
  paginatedData: mockCategories,
  columns: mockColumns,
  currentPage: 1,
  totalPages: 2,
  pageSize: 5,
  totalCount: 10,
  isLoading: false,
  errorMessage: null,
  isEmpty: false,
  isMissingData: false,
  isMoreOpen: false,
  goToPage: jest.fn(),
  nextPage: jest.fn(),
  prevPage: jest.fn(),
  changePageSize: jest.fn(),
  setSearchTerm: jest.fn(),
  onCreate: jest.fn(),
  onEdit: jest.fn(),
  onRowClick: jest.fn(),
  onBack: jest.fn(),
  onMore: jest.fn(),
  onCloseMore: jest.fn(),
  onDelete: jest.fn(),
  ...overrides,
});

const renderWithRouter = (props: MasterCategoryProps) => (
  render(
    <MemoryRouter>
      <MasterCategoryComponent {...props} />
    </MemoryRouter>,
  )
);

describe("MasterCategoryComponent", () => {
  it("should render without crashing", () => {
    renderWithRouter(createProps());

    expect(screen.getAllByText("Category list").length).toBeGreaterThan(0);
  });

  it("should handle empty data", () => {
    renderWithRouter(createProps({ paginatedData: [], totalCount: 0, totalPages: 1, isEmpty: true }));

    expect(screen.getAllByText("No categories found.").length).toBeGreaterThan(0);
  });

  it("should handle missing data message", () => {
    renderWithRouter(createProps({ paginatedData: [], totalCount: 0, totalPages: 1, isMissingData: true }));

    expect(screen.getAllByText("Category data is unavailable. Please try again.").length).toBeGreaterThan(0);
  });

  it("should handle isMoreOpen true", () => {
    renderWithRouter(createProps({ isMoreOpen: true }));

    expect(screen.getByText("New category")).toBeTruthy();
    expect(screen.getByText("Delete")).toBeTruthy();
  });

  it("should call onBack when back button clicked", () => {
    const onBack = jest.fn();
    renderWithRouter(createProps({ onBack }));

    fireEvent.click(screen.getByLabelText("Back"));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("should call onMore when more button clicked", () => {
    const onMore = jest.fn();
    renderWithRouter(createProps({ onMore }));

    fireEvent.click(screen.getByLabelText("More options"));

    expect(onMore).toHaveBeenCalledTimes(1);
  });

  it("should call onCloseMore and onCreate when New category clicked", () => {
    const onCloseMore = jest.fn();
    const onCreate = jest.fn();
    renderWithRouter(createProps({ isMoreOpen: true, onCloseMore, onCreate }));

    fireEvent.click(screen.getByText("New category"));

    expect(onCloseMore).toHaveBeenCalledTimes(1);
    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it("should call onDelete when Delete clicked", () => {
    const onDelete = jest.fn();
    const onCloseMore = jest.fn();
    renderWithRouter(createProps({ isMoreOpen: true, onDelete, onCloseMore }));

    fireEvent.click(screen.getByText("Delete"));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onCloseMore).toHaveBeenCalledTimes(1);
  });
});
