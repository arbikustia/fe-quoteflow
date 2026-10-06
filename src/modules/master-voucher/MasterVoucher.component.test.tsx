import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { MasterVoucherComponent } from "./MasterVoucher.component";
import type { MasterVoucherProps, VoucherData } from "./MasterVoucher.type";

const mockVoucher: VoucherData = {
  id: "1",
  code: "DISC10",
  discountPercent: 10,
  status: "active",
  createAt: "2024-01-01",
  createBy: "System",
};

const defaultProps: MasterVoucherProps = {
  paginatedData: [mockVoucher],
  columns: [{ key: "code", header: "Voucher Code" }],
  currentPage: 1,
  totalPages: 2,
  pageSize: 10,
  totalCount: 15,
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

describe("MasterVoucherComponent", () => {
  const renderWithRouter = (props = defaultProps) => {
    return render(
      <MemoryRouter>
        <MasterVoucherComponent {...props} />
      </MemoryRouter>
    );
  };

  it("should render without crashing", () => {
    renderWithRouter();
    expect(screen.getAllByText("Voucher List").length).toBeGreaterThan(0);
    expect(screen.getAllByText("DISC10").length).toBeGreaterThan(0);
  });

  it("should handle empty data", () => {
    renderWithRouter({ ...defaultProps, paginatedData: [], totalCount: 0, totalPages: 1 });
    expect(screen.getAllByText("No data available").length).toBeGreaterThan(0);
  });

  it("should handle isMoreOpen true", () => {
    renderWithRouter({ ...defaultProps, isMoreOpen: true });
    expect(screen.getByText("New Voucher")).toBeTruthy();
    expect(screen.getByText("Delete")).toBeTruthy();
  });

  it("calls onBack when back button clicked", () => {
    const onBack = vi.fn();
    renderWithRouter({ ...defaultProps, onBack });
    const backBtn = screen.getByLabelText("Back");
    fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onMore when more button clicked", () => {
    const onMore = vi.fn();
    renderWithRouter({ ...defaultProps, onMore });
    const moreBtn = screen.getByLabelText("More options");
    fireEvent.click(moreBtn);
    expect(onMore).toHaveBeenCalledTimes(1);
  });

  it("calls onCreate when New Voucher clicked", () => {
    const onCreate = vi.fn();
    renderWithRouter({ ...defaultProps, isMoreOpen: true, onCreate });
    fireEvent.click(screen.getByText("New Voucher"));
    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it("calls onDelete when Delete clicked", () => {
    const onDelete = vi.fn();
    renderWithRouter({ ...defaultProps, isMoreOpen: true, onDelete });
    fireEvent.click(screen.getByText("Delete"));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("matches snapshot", () => {
    const { asFragment } = renderWithRouter();
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot with empty data and closed menu", () => {
    const { asFragment } = renderWithRouter({ ...defaultProps, paginatedData: [] as VoucherData[], totalCount: 0, totalPages: 1, isMoreOpen: false });
    expect(asFragment()).toMatchSnapshot();
  });
});
