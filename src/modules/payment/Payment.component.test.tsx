import { MemoryRouter } from "react-router-dom";

import { fireEvent, render, screen } from "@/libs/unit-test";

import { PaymentComponent } from "./Payment.component";
import type { PaymentProps } from "./Payment.type";

const mockProps: PaymentProps = {
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  paginatedData: [
    {
      id: "pay-1",
      invoiceId: "INV-001",
      paymentMethodId: "Bank Transfer",
      amount: 1000000,
      paidAt: "2026-11-01T00:00:00.000Z",
      referenceNo: "REF-001",
      notes: "Deposit",
      status: "active",
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

    const createNewButtons = screen.getAllByRole("button", { name: "Create New" });

    expect(createNewButtons[0]).toBeInTheDocument();
    fireEvent.click(createNewButtons[0]);
    expect(mockProps.onCreate).toHaveBeenCalledTimes(1);
  });

  it("should show payment details on mobile and status in desktop table", () => {
    render(<MemoryRouter><PaymentComponent {...mockProps} /></MemoryRouter>);

    const card = screen.getByRole("button", { name: /REF-001.*Active.*INV-001.*Bank Transfer.*Paid at.*Amount/s });
    expect(card).toHaveClass("rounded-3xl", "border-border-strong", "bg-background-surface");
    expect(card.querySelectorAll(".text-xs, .text-sm, .text-base")).toHaveLength(0);
    expect(screen.getAllByText("REF-001")[0]).toHaveClass("text-lg");
    expect(screen.getAllByText("Active")[0]).toHaveClass("text-lg");
    const editButton = screen.getByLabelText("Edit payment");
    expect(editButton).toHaveClass("rounded-3xl");
    fireEvent.click(card);
    expect(mockProps.onRowClick).toHaveBeenCalledWith(mockProps.paginatedData[0]);
    expect(screen.getByRole("columnheader", { name: "Status" })).toBeInTheDocument();
    expect(screen.getAllByText("Active")).toHaveLength(2);
  });

  it("should match loading card and table columns", () => {
    render(<MemoryRouter><PaymentComponent {...mockProps} isLoading={true} paginatedData={[]} /></MemoryRouter>);

    const cards = screen.getAllByRole("status", { name: "Loading payment card" });
    expect(cards).toHaveLength(5);
    expect(cards[0]).toHaveClass("rounded-3xl", "border-border-strong", "shadow-small");
    expect(cards[0].querySelectorAll(".border-t")).toHaveLength(1);
    const table = screen.getByRole("status", { name: "Loading payment table" });
    expect(table.querySelectorAll("thead th")).toHaveLength(9);
    expect(table.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(table.querySelectorAll("tbody tr:first-child td")).toHaveLength(9);
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
