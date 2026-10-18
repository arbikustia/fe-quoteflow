import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MasterVoucherComponent } from "./MasterVoucher.component";
import type { MasterVoucherProps, VoucherData } from "./MasterVoucher.type";

const mockVoucher: VoucherData = {
  id: "1",
  name: "Discount Voucher",
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
  goToPage: jest.fn(),
  nextPage: jest.fn(),
  prevPage: jest.fn(),
  changePageSize: jest.fn(),
  setSearchTerm: jest.fn(),
  isLoading: false,
  errorMessage: null,
  isEmpty: false,
  isMissingData: false,
  onCreate: jest.fn(),
  onEdit: jest.fn(),
  onRowClick: jest.fn(),
  onBack: jest.fn(),
  onMore: jest.fn(),
  isMoreOpen: false,
  onCloseMore: jest.fn(),
  onDelete: jest.fn(),
};

describe("MasterVoucherComponent", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-10-18T01:30:00+07:00"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

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
    renderWithRouter({ ...defaultProps, paginatedData: [], isEmpty: true, totalCount: 0, totalPages: 1 });
    expect(screen.getAllByText("No vouchers found.").length).toBeGreaterThan(0);
  });

  it("calls onBack when back button clicked", () => {
    const onBack = jest.fn();
    renderWithRouter({ ...defaultProps, onBack });
    const backBtn = screen.getByLabelText("Back");
    fireEvent.click(backBtn);
    expect(onBack).toHaveBeenCalledTimes(1);
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
