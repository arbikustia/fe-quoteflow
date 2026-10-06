import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { MasterItemComponent } from "./MasterItem.component";
import type { ItemData } from "./MasterItem.type";

const mockItems: ItemData[] = [
  { id: "1", name: "Speaker", category: "Audio", price: 5000000, stock: 12, image: "https://example.com/a.jpg", duration: "3 days", remark: "ok", unit: "unit", status: "active", createAt: "2024-01-01", createBy: "Admin" },
  { id: "2", name: "Light", category: "Lighting", price: 600000, stock: 5, image: "https://example.com/b.jpg", duration: "1 day", remark: "sharp", unit: "unit", status: "inactive", createAt: "2024-01-02", createBy: "Admin" },
];

const mockColumns: any[] = [{ key: "name", header: "Item Name" }];

const defaultProps = {
  paginatedData: mockItems,
  columns: mockColumns,
  currentPage: 1,
  totalPages: 2,
  pageSize: 5,
  totalCount: 10,
  goToPage: vi.fn(),
  nextPage: vi.fn(),
  prevPage: vi.fn(),
  changePageSize: vi.fn(),
  onCreate: vi.fn(),
  onEdit: vi.fn(),
  onRowClick: vi.fn(),
  onBack: vi.fn(),
  onMore: vi.fn(),
  isMoreOpen: false,
  onCloseMore: vi.fn(),
  onDelete: vi.fn(),
};

const renderWithRouter = (props = defaultProps) =>
  render(
    <MemoryRouter>
      <MasterItemComponent {...props} />
    </MemoryRouter>
  );

describe("MasterItemComponent", () => {
  it("should render without crashing", () => {
    renderWithRouter();
    expect(screen.getByText("Product List")).toBeInTheDocument();
  });

  it("should handle empty data", () => {
    renderWithRouter({ ...defaultProps, paginatedData: [] as ItemData[], totalCount: 0, totalPages: 1 });
    expect(screen.getByText("Product List")).toBeInTheDocument();
  });

  it("should handle isMoreOpen true", () => {
    renderWithRouter({ ...defaultProps, isMoreOpen: true });
    expect(screen.getByText("New Item")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("calls onBack when back button clicked", () => {
    const onBack = vi.fn();
    renderWithRouter({ ...defaultProps, onBack });
    fireEvent.click(screen.getByLabelText("Back"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onMore when more button clicked", () => {
    const onMore = vi.fn();
    renderWithRouter({ ...defaultProps, onMore });
    fireEvent.click(screen.getByLabelText("More options"));
    expect(onMore).toHaveBeenCalledTimes(1);
  });

  it("calls onCloseMore and onCreate when New Item clicked", () => {
    const onCloseMore = vi.fn();
    const onCreate = vi.fn();
    renderWithRouter({ ...defaultProps, isMoreOpen: true, onCloseMore, onCreate });
    fireEvent.click(screen.getByText("New Item"));
    expect(onCloseMore).toHaveBeenCalledTimes(1);
    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it("calls onDelete when Delete clicked", () => {
    const onDelete = vi.fn();
    const onCloseMore = vi.fn();
    renderWithRouter({ ...defaultProps, isMoreOpen: true, onDelete, onCloseMore });
    fireEvent.click(screen.getByText("Delete"));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <MemoryRouter>
        <MasterItemComponent {...defaultProps} />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot with empty data and closed menu", () => {
    const { asFragment } = render(
      <MemoryRouter>
        <MasterItemComponent {...{ ...defaultProps, paginatedData: [] as ItemData[], totalCount: 0, totalPages: 1, isMoreOpen: false }} />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
