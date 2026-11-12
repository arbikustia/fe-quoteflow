import { fireEvent, render, screen } from "@/libs/unit-test";

import MasterOrderTypeComponent from "./MasterOrderType.component";
import type { MasterOrderTypeProps, OrderTypeData } from "./MasterOrderType.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const ORDER_TYPE: OrderTypeData = {
  id: "order-type-1",
  name: "Delivery",
  isHandover: "yes",
  status: "active",
  createdAt: "30 Oktober 2026 21:09",
};

/**
 * Build list view props.
 * @param {Partial<MasterOrderTypeProps>} [overrides] - Props to override
 * @returns {MasterOrderTypeProps} - Component props
 */
const createProps = (overrides?: Partial<MasterOrderTypeProps>): MasterOrderTypeProps => ({
  listStatus: "ready",
  orderTypes: [ORDER_TYPE],
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
  ...overrides,
});

describe("MasterOrderTypeComponent", () => {
  it("should render order types in the table and mobile cards", () => {
    render(<MasterOrderTypeComponent {...createProps()} />);

    expect(screen.getAllByText("Delivery")).toHaveLength(2);
    expect(screen.getAllByText("30 Oktober 2026 21:09")).toHaveLength(2);
    expect(screen.getByText("Handover Required")).toBeInTheDocument();
  });

  it("should open edit from a mobile card and the row action", () => {
    const props = createProps();

    render(<MasterOrderTypeComponent {...props} />);
    fireEvent.click(screen.getAllByText("Delivery")[0].closest("button") as HTMLButtonElement);
    fireEvent.click(screen.getByRole("button", { name: "Edit order type Delivery" }));

    expect(props.onEdit).toHaveBeenCalledTimes(2);
  });

  it("should call create and search handlers", () => {
    const props = createProps();

    render(<MasterOrderTypeComponent {...props} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Create New" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Create Order Type" }));
    fireEvent.change(screen.getAllByPlaceholderText("Search order type")[0], { target: { value: "delivery" } });

    expect(props.onCreate).toHaveBeenCalledTimes(2);
    expect(props.onSearchChange).toHaveBeenCalledTimes(1);
  });

  it("should hide create and edit actions without permission", () => {
    render(<MasterOrderTypeComponent {...createProps({ canCreate: false, canEdit: false })} />);

    expect(screen.queryByRole("button", { name: "Create New" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Create Order Type" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit order type Delivery" })).not.toBeInTheDocument();
    expect(screen.getAllByText("Delivery")[0].closest("button")).toBeDisabled();
  });

  it("should render matching table and card skeletons while loading", () => {
    render(<MasterOrderTypeComponent {...createProps({ listStatus: "loading", orderTypes: [] })} />);

    const tableSkeleton = screen.getByRole("status", { name: "Loading order type table" });

    expect(tableSkeleton.querySelectorAll("th")).toHaveLength(6);
    expect(tableSkeleton.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(screen.getAllByRole("status", { name: "Loading order type card" })).toHaveLength(5);
  });

  it.each([
    ["empty", "No order types found."],
    ["error", "Unable to load order types."],
    ["missing", "Order type data is unavailable. Please try again."],
  ] as const)("should render the %s message in both layouts", (listStatus, message) => {
    render(<MasterOrderTypeComponent {...createProps({ listStatus, orderTypes: [] })} />);

    expect(screen.getAllByText(message)).toHaveLength(2);
  });

  it("should show the success toast passed from the form page", () => {
    render(<MasterOrderTypeComponent {...createProps({ successMessage: "Order type created successfully." })} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Order type created successfully.");
  });
});
