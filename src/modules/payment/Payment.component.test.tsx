import { MemoryRouter } from "react-router-dom";

import { fireEvent, render, screen } from "@/libs/unit-test";

import { PaymentComponent } from "./Payment.component";
import type { PaymentProps } from "./Payment.type";

jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("@/app/shared/PageLayout", () => ({
  PageLayout: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <section><h1>{title}</h1>{children}</section>
  ),
}));

const mockProps: PaymentProps = {
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  paginatedData: [
    {
      id: "pay-1",
      invoiceId: "invoice-1",
      paymentMethodId: "payment-method-1",
      invoiceNo: "INV-001",
      customerName: "ADE PUTRI",
      amount: 1000000,
      paidAt: "2026-11-01T00:00:00.000Z",
      referenceNo: "",
      notes: "Deposit",
      status: "active",
      statusLabel: "Paid",
      grandTotal: 1000000,
      remainingAmount: 0,
      createdAt: "",
    },
  ],
  totalCount: 1,
  isLoading: false,
  errorMessage: null,
  isMissingData: false,
  isEmpty: false,
  goToPage: jest.fn(),
  changePageSize: jest.fn(),
  setSearchTerm: jest.fn(),
  onBack: jest.fn(),
  onCreate: jest.fn(),
  onEdit: jest.fn(),
  onRowClick: jest.fn(),
};

describe("PaymentComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render mobile create button and trigger onCreate", () => {
    render(
      <MemoryRouter>
        <PaymentComponent {...mockProps} />
      </MemoryRouter>,
    );

    const createButton = screen.getByRole("button", { name: "Create Payment" });

    expect(createButton).toBeInTheDocument();
    fireEvent.click(createButton);
    expect(mockProps.onCreate).toHaveBeenCalledTimes(1);
  });

  it("should show payment details on mobile and status in desktop table", () => {
    render(<MemoryRouter><PaymentComponent {...mockProps} /></MemoryRouter>);

    const card = screen.getByRole("button", { name: /INV-001.*Paid.*.*ADE PUTRI.*Paid at.*Amount/s });
    expect(card).toHaveClass("rounded-3xl", "border-border-strong", "bg-background-surface");
    expect(card.querySelectorAll(".text-xs, .text-sm")).toHaveLength(0);
    expect(screen.getAllByText("INV-001")[0]).toHaveClass("text-lg");
    expect(screen.getAllByText("Paid")[0]).toHaveClass("text-base");
    const viewButton = screen.getByLabelText("View payment detail");
    expect(viewButton).toHaveClass("rounded-3xl");
    fireEvent.click(viewButton);
    expect(mockProps.onRowClick).toHaveBeenCalledWith(mockProps.paginatedData[0]);
    expect(screen.getByLabelText("Edit payment")).toHaveClass("rounded-3xl");
    fireEvent.click(card);
    expect(mockProps.onRowClick).toHaveBeenCalledTimes(2);
    expect(screen.getByRole("columnheader", { name: "Status" })).toBeInTheDocument();
  });

  it("should match loading card and table columns", () => {
    render(<MemoryRouter><PaymentComponent {...mockProps} isLoading={true} paginatedData={[]} /></MemoryRouter>);

    const cards = screen.getAllByRole("status", { name: "Loading payment card" });
    expect(cards).toHaveLength(5);
    expect(cards[0]).toHaveClass("rounded-3xl", "border-border-strong", "shadow-small");
    expect(cards[0].querySelectorAll(".border-t")).toHaveLength(1);
    const table = screen.getByRole("status", { name: "Loading payment table" });
    expect(table.querySelectorAll("thead th")).toHaveLength(8);
    expect(table.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(table.querySelectorAll("tbody tr:first-child td")).toHaveLength(8);
  });

  it("should hide create and edit actions when callbacks are unavailable", () => {
    render(
      <MemoryRouter>
        <PaymentComponent {...mockProps} onCreate={undefined} onEdit={undefined} />
      </MemoryRouter>,
    );

    expect(screen.queryByRole("button", { name: "Create Payment" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit payment" })).not.toBeInTheDocument();
  });

  it("should trigger search when input changes", () => {
    render(
      <MemoryRouter>
        <PaymentComponent {...mockProps} />
      </MemoryRouter>,
    );

    const searchInputs = screen.getAllByPlaceholderText("Search payment");

    fireEvent.change(searchInputs[0], { target: { value: "REF-001" } });
    expect(mockProps.setSearchTerm).toHaveBeenCalledWith("REF-001");
  });
});
