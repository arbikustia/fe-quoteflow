import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@/libs/unit-test";
import { MemoryRouter } from "react-router-dom";

import { QuotationComponent } from "./Quotation.component";
import type { QuotationData, QuotationProps } from "./Quotation.type";

const MOCK_ROWS: QuotationData[] = [
  {
    id: "q-1",
    transactionId: "tx-1",
    quotationNumber: "QUO-001",
    customerName: "PT Example",
    name: "Annual Gala",
    quotationDate: "2026-10-01",
    customerPhone: "0812345678",
    location: "Jakarta Convention Center",
    startDate: "2026-11-01",
    endDate: "2026-11-02",
    grandTotal: 15000000,
    status: 1,
  },
];

const createProps = (overrides?: Partial<QuotationProps>): QuotationProps => {
  const onEdit = jest.fn();
  const onRowClick = jest.fn();
  const onBack = jest.fn();
  const goToPage = jest.fn();
  const changePageSize = jest.fn();
  const setSearchTerm = jest.fn();

  return {
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 1,
    paginatedData: MOCK_ROWS,
    isLoading: false,
    errorMessage: null,
    isMissingData: false,
    isEmpty: false,
    goToPage,
    changePageSize,
    setSearchTerm,
    onBack,
    onEdit,
    onDetail: jest.fn(),
    onStatus: jest.fn(),
    onRowClick,
    ...overrides,
  };
};

describe("QuotationComponent", () => {
  it("renders quotation table columns without create button", () => {
    const props = createProps();
    render(<MemoryRouter><QuotationComponent {...props} /></MemoryRouter>);

    expect(screen.queryByRole("button", { name: /create|add quotation/i })).toBeNull();
    expect(screen.getAllByText("QUO-001").length).toBeGreaterThan(0);
    expect(screen.getAllByText("PT Example").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Annual Gala").length).toBeGreaterThan(0);
    expect(screen.getAllByText("2026-10-01").length).toBeGreaterThan(0);
    expect(screen.getAllByText("2026-11-01").length).toBeGreaterThan(0);
    expect(screen.getAllByText("2026-11-02").length).toBeGreaterThan(0);
  });

  it("should open detail when table row is clicked", (): void => {
    const onRowClick = jest.fn();
    const props = createProps({ onRowClick });
    render(<MemoryRouter><QuotationComponent {...props} /></MemoryRouter>);

    const row = screen.getAllByText("QUO-001")[0].closest("tr");

    if (!row) {
      throw new Error("Quotation row was not rendered.");
    }

    fireEvent.click(row);

    expect(onRowClick).toHaveBeenCalledWith(MOCK_ROWS[0]);
  });

  it("handles search input change", () => {
    const setSearchTerm = jest.fn();
    const props = createProps({ setSearchTerm });
    render(<MemoryRouter><QuotationComponent {...props} /></MemoryRouter>);

    const inputs = screen.getAllByPlaceholderText("Search quotation");
    fireEvent.change(inputs[0], { target: { value: "Annual" } });

    expect(setSearchTerm).toHaveBeenCalledWith("Annual");
  });

  it("renders loading skeleton when loading", () => {
    const props = createProps({ isLoading: true, paginatedData: [] });
    render(<MemoryRouter><QuotationComponent {...props} /></MemoryRouter>);

    expect(screen.getAllByRole("status", { name: "Loading" }).length).toBeGreaterThan(0);
  });

  it("renders error message on error", () => {
    const props = createProps({ errorMessage: "Failed to fetch", paginatedData: [] });
    render(<MemoryRouter><QuotationComponent {...props} /></MemoryRouter>);

    expect(screen.getAllByText("Failed to fetch").length).toBeGreaterThan(0);
  });
});
