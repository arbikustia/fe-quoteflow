import { fireEvent, render, screen } from "@/libs/unit-test";

import MasterCustomerComponent from "./MasterCustomer.component";
import type { MasterCustomerProps } from "./MasterCustomer.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const CUSTOMER = { id: "1", name: "PT Mega Jaya Abadi", email: "—", address: "Jl. Sudirman", phoneNumber: "0812345678", status: "active" } as const;

/**
 * Build list view props.
 * @param {Partial<MasterCustomerProps>} [overrides] - Props to override
 * @returns {MasterCustomerProps} - Component props
 */
const createProps = (overrides?: Partial<MasterCustomerProps>): MasterCustomerProps => ({
  listStatus: "ready",
  customers: [CUSTOMER],
  totalPages: 1,
  totalCount: 1,
  currentPage: 1,
  pageSize: 10,
  onPageChange: jest.fn(),
  onPageSizeChange: jest.fn(),
  onSearchChange: jest.fn(),
  onBack: jest.fn(),
  onCreate: jest.fn(),
  onEdit: jest.fn(),
  ...overrides,
});

describe("MasterCustomerComponent", () => {
  it("should render customers in the table and mobile cards", () => {
    render(<MasterCustomerComponent {...createProps()} />);

    expect(screen.getAllByText("PT Mega Jaya Abadi")).toHaveLength(2);
    expect(screen.getAllByText("—")).toHaveLength(2);
  });

  it("should open edit from a mobile card", () => {
    const props = createProps();

    render(<MasterCustomerComponent {...props} />);
    fireEvent.click(screen.getAllByText("PT Mega Jaya Abadi")[0].closest("button") as HTMLButtonElement);

    expect(props.onEdit).toHaveBeenCalledWith(CUSTOMER);
  });

  it("should call create from both create buttons and search on input", () => {
    const props = createProps();

    render(<MasterCustomerComponent {...props} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Create New" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Create Customer" }));
    fireEvent.change(screen.getAllByPlaceholderText("Search customer")[0], { target: { value: "mega" } });

    expect(props.onCreate).toHaveBeenCalledTimes(2);
    expect(props.onSearchChange).toHaveBeenCalledTimes(1);
  });

  it("should render matching table and card skeletons while loading", () => {
    render(<MasterCustomerComponent {...createProps({ listStatus: "loading", customers: [] })} />);

    const tableSkeleton = screen.getByRole("status", { name: "Loading customer table" });

    expect(tableSkeleton.querySelectorAll("th")).toHaveLength(7);
    expect(tableSkeleton.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(tableSkeleton.querySelectorAll("tbody tr:first-child td:last-child span")).toHaveLength(1);
    expect(screen.getAllByRole("status", { name: "Loading customer card" })).toHaveLength(5);
  });

  it.each([
    ["empty", "No customers found."],
    ["error", "Unable to load customers."],
    ["missing", "Customer data is unavailable. Please try again."],
  ] as const)("should render the %s message in both layouts", (listStatus, message) => {
    render(<MasterCustomerComponent {...createProps({ listStatus, customers: [] })} />);

    expect(screen.getAllByText(message)).toHaveLength(2);
  });

  it("should show the success toast passed from the form page", () => {
    render(<MasterCustomerComponent {...createProps({ successMessage: "Customer created successfully." })} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Customer created successfully.");
  });
});
