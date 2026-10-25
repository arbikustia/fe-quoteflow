import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { MasterCategoryComponent } from "./MasterCategory.component";
import type { CategoryData, MasterCategoryProps } from "./MasterCategory.type";

const mockCategories: CategoryData[] = [
  { id: "1", categoryName: "Audio System", status: "active", createAt: "2024-02-01", createBy: "Admin" },
  { id: "2", categoryName: "Lighting", status: "inactive", createAt: "2024-03-01", createBy: "Admin" },
];

const createProps = (overrides?: Partial<MasterCategoryProps>): MasterCategoryProps => ({
  paginatedData: mockCategories,
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

    expect(screen.getAllByText("Category List").length).toBeGreaterThan(0);
  });

  it("should handle empty data", () => {
    renderWithRouter(createProps({ paginatedData: [], totalCount: 0, totalPages: 1, isEmpty: true }));

    expect(screen.getAllByText("No categories found.").length).toBeGreaterThan(0);
  });

  it("should handle missing data message", () => {
    renderWithRouter(createProps({ paginatedData: [], totalCount: 0, totalPages: 1, isMissingData: true }));

    expect(screen.getAllByText("Category data is unavailable. Please try again.").length).toBeGreaterThan(0);
  });

  it("should call onBack when back button clicked", () => {
    const onBack = jest.fn();
    renderWithRouter(createProps({ onBack }));

    fireEvent.click(screen.getByLabelText("Back"));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

});
