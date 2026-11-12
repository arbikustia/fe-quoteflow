import { MOCK_API_PAYMENT_METHODS } from "@/fixture/master-payment-method";
import { fireEvent, render, screen } from "@/libs/unit-test";

import MasterPaymentMethodComponent from "./MasterPaymentMethod.component";
import type { MasterPaymentMethodProps, PaymentMethodData } from "./MasterPaymentMethod.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div data-testid="layout">{children}</div>);

const PAYMENT_METHOD: PaymentMethodData = {
  id: "payment-method-1",
  name: "BCA",
  description: "No Admin Fee",
  status: "active",
  createdAt: "30 Oktober 2026 22:00",
  source: MOCK_API_PAYMENT_METHODS[0],
};

/**
 * Build list view props.
 * @param {Partial<MasterPaymentMethodProps>} [overrides] - Props to override
 * @returns {MasterPaymentMethodProps} - Component props
 */
const createProps = (overrides?: Partial<MasterPaymentMethodProps>): MasterPaymentMethodProps => ({
  listStatus: "ready",
  paymentMethods: [PAYMENT_METHOD],
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

describe("MasterPaymentMethodComponent", () => {
  it("should render payment methods in the table and mobile cards", () => {
    render(<MasterPaymentMethodComponent {...createProps()} />);

    expect(screen.getAllByText("BCA")).toHaveLength(2);
    expect(screen.getAllByText("No Admin Fee")).toHaveLength(2);
  });

  it("should open edit from a mobile card and the row action", () => {
    const props = createProps();

    render(<MasterPaymentMethodComponent {...props} />);
    fireEvent.click(screen.getAllByText("BCA")[0].closest("button") as HTMLButtonElement);
    fireEvent.click(screen.getByRole("button", { name: "Edit payment method BCA" }));

    expect(props.onEdit).toHaveBeenCalledTimes(2);
  });

  it("should call create and search handlers", () => {
    const props = createProps();

    render(<MasterPaymentMethodComponent {...props} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Create New" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "Create Payment Method" }));
    fireEvent.change(screen.getAllByPlaceholderText("Search payment method")[0], { target: { value: "bca" } });

    expect(props.onCreate).toHaveBeenCalledTimes(2);
    expect(props.onSearchChange).toHaveBeenCalledTimes(1);
  });

  it("should hide create and edit actions without permission", () => {
    render(<MasterPaymentMethodComponent {...createProps({ canCreate: false, canEdit: false })} />);

    expect(screen.queryByRole("button", { name: "Create New" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Create Payment Method" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit payment method BCA" })).not.toBeInTheDocument();
    expect(screen.getAllByText("BCA")[0].closest("button")).toBeDisabled();
  });

  it("should render matching table and card skeletons while loading", () => {
    render(<MasterPaymentMethodComponent {...createProps({ listStatus: "loading", paymentMethods: [] })} />);

    const tableSkeleton = screen.getByRole("status", { name: "Loading payment method table" });

    expect(tableSkeleton.querySelectorAll("th")).toHaveLength(6);
    expect(tableSkeleton.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(screen.getAllByRole("status", { name: "Loading payment method card" })).toHaveLength(5);
  });

  it.each([
    ["empty", "No payment methods found."],
    ["error", "Unable to load payment methods."],
    ["missing", "Payment method data is unavailable. Please try again."],
  ] as const)("should render the %s message in both layouts", (listStatus, message) => {
    render(<MasterPaymentMethodComponent {...createProps({ listStatus, paymentMethods: [] })} />);

    expect(screen.getAllByText(message)).toHaveLength(2);
  });

  it("should show the success toast passed from the form page", () => {
    render(<MasterPaymentMethodComponent {...createProps({ successMessage: "Payment method created successfully." })} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Payment method created successfully.");
  });
});
