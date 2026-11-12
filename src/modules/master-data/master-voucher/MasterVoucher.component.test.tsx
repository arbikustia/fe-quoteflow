import { fireEvent, render, screen } from "@/libs/unit-test";

import MasterVoucherComponent from "./MasterVoucher.component";
import type { MasterVoucherProps, VoucherData } from "./MasterVoucher.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const VOUCHER: VoucherData = {
  id: "voucher-1",
  name: "Summer Promo",
  code: "SLABC123",
  discountPercent: 10,
  status: "active",
  createdAt: "30 Oktober 2026 22:00",
};

/**
 * Build list view props.
 * @param {Partial<MasterVoucherProps>} [overrides] - Props to override
 * @returns {MasterVoucherProps} - Component props
 */
const createProps = (overrides?: Partial<MasterVoucherProps>): MasterVoucherProps => ({
  listStatus: "ready",
  vouchers: [VOUCHER],
  totalPages: 1,
  totalCount: 1,
  currentPage: 1,
  pageSize: 10,
  canCreate: true,
  canEdit: true,
  onPageChange: jest.fn(),
  onPageSizeChange: jest.fn(),
  onSearchChange: jest.fn(),
  onBack: jest.fn(),
  onCreate: jest.fn(),
  onEdit: jest.fn(),
  onDownload: jest.fn(),
  ...overrides,
});

describe("MasterVoucherComponent", () => {
  it("should render vouchers in the table and mobile cards", () => {
    render(<MasterVoucherComponent {...createProps()} />);

    expect(screen.getByText("Summer Promo")).toBeInTheDocument();
    expect(screen.getAllByText("SLABC123")).toHaveLength(2);
    expect(screen.getAllByText("10%")).toHaveLength(2);
  });

  it("should open edit from a mobile card and the row action, and download from the row", () => {
    const props = createProps();

    render(<MasterVoucherComponent {...props} />);
    fireEvent.click(screen.getAllByText("SLABC123")[0].closest("button") as HTMLButtonElement);
    fireEvent.click(screen.getByRole("button", { name: "Edit voucher SLABC123" }));
    fireEvent.click(screen.getByRole("button", { name: "Download voucher SLABC123" }));

    expect(props.onEdit).toHaveBeenCalledTimes(2);
    expect(props.onDownload).toHaveBeenCalledWith(VOUCHER);
  });

  it("should call create and search handlers", () => {
    const props = createProps();

    render(<MasterVoucherComponent {...props} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Create New" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Create Voucher" }));
    fireEvent.change(screen.getAllByPlaceholderText("Search voucher")[0], { target: { value: "summer" } });

    expect(props.onCreate).toHaveBeenCalledTimes(2);
    expect(props.onSearchChange).toHaveBeenCalledTimes(1);
  });

  it("should hide create and edit actions without permission", () => {
    render(<MasterVoucherComponent {...createProps({ canCreate: false, canEdit: false })} />);

    expect(screen.queryByRole("button", { name: "Create New" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Create Voucher" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit voucher SLABC123" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Download voucher SLABC123" })).toBeInTheDocument();
    expect(screen.getAllByText("SLABC123")[0].closest("button")).toBeDisabled();
  });

  it("should render matching table and card skeletons while loading", () => {
    render(<MasterVoucherComponent {...createProps({ listStatus: "loading", vouchers: [] })} />);

    const tableSkeleton = screen.getByRole("status", { name: "Loading voucher table" });

    expect(tableSkeleton.querySelectorAll("th")).toHaveLength(7);
    expect(tableSkeleton.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(screen.getAllByRole("status", { name: "Loading voucher card" })).toHaveLength(5);
  });

  it.each([
    ["empty", "No vouchers found."],
    ["error", "Unable to load vouchers."],
    ["missing", "Voucher data is unavailable. Please try again."],
  ] as const)("should render the %s message in both layouts", (listStatus, message) => {
    render(<MasterVoucherComponent {...createProps({ listStatus, vouchers: [] })} />);

    expect(screen.getAllByText(message)).toHaveLength(2);
  });

  it("should show the success toast passed from the form page", () => {
    render(<MasterVoucherComponent {...createProps({ successMessage: "Voucher created successfully." })} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Voucher created successfully.");
  });
});
