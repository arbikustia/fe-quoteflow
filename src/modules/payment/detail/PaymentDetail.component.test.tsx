import { fireEvent, render, screen } from "@/libs/unit-test";
import { MemoryRouter } from "react-router-dom";

import { PaymentDetailComponent } from "./PaymentDetail.component";
import type { PaymentData, PaymentDetailState } from "../Payment.type";

jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("@/app/shared/PageLayout", () => ({
  PageLayout: ({ children, title, onBack, headerRight }: { children: React.ReactNode; title: string; onBack: () => void; headerRight?: React.ReactNode }) => (
    <section><h1>{title}</h1><button type="button" onClick={onBack}>Back</button>{headerRight}{children}</section>
  ),
}));

const PAYMENT: PaymentData = {
  id: "pay-1",
  invoiceId: "INV-001",
  paymentMethodId: "BCA",
  invoiceNo: "INV-2026-001",
  customerName: "PT Example",
  amount: 1500000,
  paidAt: "2026-11-01T10:00:00.000Z",
  referenceNo: "PAY-REF-001",
  notes: "Full payment via BCA Transfer",
  status: "active",
  statusLabel: "Lunas",
  grandTotal: 1500000,
  remainingAmount: 0,
  createdAt: "",
};

const ENTRIES = [
  {
    id: "entry-1",
    payment_method_id: "method-1",
    payment_method_name: "BCA",
    amount: 1500000,
    paid_at: "2026-11-01 00:00:00",
    notes: "Full payment via BCA Transfer",
  },
];

const createProps = (payment: PaymentData | null = PAYMENT): PaymentDetailState => ({
  payment,
  paymentEntries: ENTRIES,
  linkedInvoice: {
    id: "INV-001",
    invoice_no: "INV-2026-001",
    customer_name: "PT Example",
    event_name: "Annual Gala",
  },
  methodName: "Bank Central Asia",
  isLoading: false,
  errorMessage: null,
  goBack: jest.fn(),
  handleStatus: jest.fn(),
});

describe("PaymentDetailComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render payment overview, info, and summary sections", () => {
    const props = createProps();
    render(
      <MemoryRouter>
        <PaymentDetailComponent {...props} />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Payment Method")).toBeNull();
    expect(screen.queryByText("Bank Central Asia")).toBeNull();
    expect(screen.getAllByText("INV-2026-001").length).toBeGreaterThan(0);
    expect(screen.getAllByText("PT Example").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Annual Gala").length).toBeGreaterThan(0);
    expect(screen.getByText("Grand Total")).toBeInTheDocument();
    expect(screen.getByText("Payment History (1)")).toBeInTheDocument();
    expect(screen.getByText("Full payment via BCA Transfer")).toBeInTheDocument();
    expect(screen.getAllByText("Lunas").length).toBeGreaterThan(0);
  });

  it("should render loading skeleton when isLoading is true", () => {
    const props = { ...createProps(null), isLoading: true };
    render(
      <MemoryRouter>
        <PaymentDetailComponent {...props} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("status", { name: "Loading payment detail" })).toBeInTheDocument();
    expect(screen.getByLabelText("Loading payment overview")).toBeInTheDocument();
  });

  it("should render error message when errorMessage is provided", () => {
    const props = { ...createProps(null), errorMessage: "Unable to load payment detail." };
    render(
      <MemoryRouter>
        <PaymentDetailComponent {...props} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Unable to load payment detail.");
  });

  it("should render unavailable state when payment is null", () => {
    const props = createProps(null);
    render(
      <MemoryRouter>
        <PaymentDetailComponent {...props} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Payment detail is unavailable.")).toBeInTheDocument();
  });

  it("should not render edit actions", () => {
    const props = createProps();
    render(
      <MemoryRouter>
        <PaymentDetailComponent {...props} />
      </MemoryRouter>,
    );

    expect(screen.queryByRole("button", { name: /Edit/i })).not.toBeInTheDocument();
    expect(screen.queryByTestId("payment-detail-actions")).not.toBeInTheDocument();
  });

  it("should call goBack when back button is clicked", () => {
    const props = createProps();
    render(
      <MemoryRouter>
        <PaymentDetailComponent {...props} />
      </MemoryRouter>,
    );

    const backButtons = screen.getAllByRole("button", { name: "Back" });
    fireEvent.click(backButtons[0]);
    expect(props.goBack).toHaveBeenCalled();
  });
});
