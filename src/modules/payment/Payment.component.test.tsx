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
