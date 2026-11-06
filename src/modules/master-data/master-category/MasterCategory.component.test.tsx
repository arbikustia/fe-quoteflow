import { describe, expect, it, jest } from "@jest/globals";
import { MemoryRouter } from "react-router-dom";

import { fireEvent, render, screen } from "@/libs/unit-test";

import { MasterCategoryComponent } from "./MasterCategory.component";
import type { CategoryData, MasterCategoryProps } from "./MasterCategory.type";

jest.mock("../../app/layout", () =>
  ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
);

const mockCategories: CategoryData[] = [
  { id: "1", categoryName: "Audio System", status: "active", createAt: "2026-06-08", createBy: "Admin" },
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
    expect(screen.getAllByText("Manage product and item categories")).toHaveLength(2);
  });

  it("should use quotation-sized text and Indonesian long date in mobile cards", () => {
    const { container } = renderWithRouter(createProps());
    const mobileCard = container.querySelector(".lg\\:hidden button.group");

    expect(mobileCard).not.toBeNull();
    expect(mobileCard?.querySelector(".text-xs, .text-sm")).toBeNull();
    expect(mobileCard?.classList.contains("rounded-3xl")).toBe(true);
    expect(mobileCard?.classList.contains("bg-background-surface")).toBe(true);
    expect(mobileCard?.textContent).toContain("active");
    expect(mobileCard?.querySelector(".border-t.border-border-default")?.textContent).toContain("Created");
    expect(screen.getAllByText(/2026/)).toHaveLength(2);
    expect(container.querySelector(".lg\\:hidden .text-lg")).not.toBeNull();
  });

  it("should render matching mobile and desktop loading skeletons", () => {
    renderWithRouter(createProps({ isLoading: true, paginatedData: [] }));

    const tableSkeleton = screen.getByRole("status", { name: "Loading category table" });
    const cardSkeletons = screen.getAllByRole("status", { name: "Loading category card" });
    expect(tableSkeleton.querySelectorAll("th")).toHaveLength(5);
    expect(tableSkeleton.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(tableSkeleton.querySelectorAll("tbody tr:first-child td")).toHaveLength(5);
    expect(tableSkeleton.querySelectorAll("tbody tr:first-child td:last-child span")).toHaveLength(1);
    expect(cardSkeletons).toHaveLength(5);
    expect(cardSkeletons[0].classList.contains("rounded-3xl")).toBe(true);
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
