import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@/libs/unit-test";
import { MemoryRouter } from "react-router-dom";

import { QuotationComponent } from "./Quotation.component";
import type { QuotationData, QuotationProps } from "./Quotation.type";

const mockGenerateQuotationPDF = jest.fn();
jest.mock("@/utils/pdfGenerator", () => ({
  generateQuotationPDF: (...args: unknown[]) => mockGenerateQuotationPDF(...args),
}));

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
  {
    id: "q-2",
    transactionId: "tx-2",
    quotationNumber: "QUO-002",
    customerName: "PT Approved",
    name: "Tech Summit",
    quotationDate: "2026-10-02",
    customerPhone: "0812345679",
    location: "Bali",
    startDate: "2026-11-05",
    endDate: "2026-11-06",
    grandTotal: 25000000,
    status: 2,
  },
  {
    id: "q-3",
    transactionId: "tx-3",
    quotationNumber: "QUO-003",
    customerName: "PT Cancelled",
    name: "Canceled Meet",
    quotationDate: "2026-10-03",
    customerPhone: "0812345680",
    location: "Surabaya",
    startDate: "2026-11-10",
    endDate: "2026-11-11",
    grandTotal: 10000000,
    status: 0,
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
    expect(screen.getByText("Status")).toBeTruthy();
    expect(screen.getAllByText("QUO-001").length).toBeGreaterThan(0);
    expect(screen.getAllByText("PT Example").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Annual Gala").length).toBeGreaterThan(0);
    expect(screen.getAllByText("2026-10-01").length).toBeGreaterThan(0);
    expect(screen.getAllByText("2026-11-01").length).toBeGreaterThan(0);
    expect(screen.getAllByText("2026-11-02").length).toBeGreaterThan(0);
    expect(screen.getByText("Quotation Created")).toBeTruthy();
    expect(screen.getByText("Approved")).toBeTruthy();
    expect(screen.getByText("Cancelled")).toBeTruthy();
  });

  it("handles download PDF action click", () => {
    const props = createProps();
    render(<MemoryRouter><QuotationComponent {...props} /></MemoryRouter>);

    const downloadButtons = screen.getAllByRole("button", { name: "Download PDF" });
    expect(downloadButtons.length).toBeGreaterThan(0);

    fireEvent.click(downloadButtons[0]);
    expect(mockGenerateQuotationPDF).toHaveBeenCalled();
  });

  it("should open detail when table row is clicked", (): void => {
    const onRowClick = jest.fn();
    const props = createProps({ onRowClick });
    render(<MemoryRouter><QuotationComponent {...props} /></MemoryRouter>);

    const card = screen.getAllByText("QUO-001")[0].closest("button");

    if (!card) {
      throw new Error("Quotation card was not rendered.");
    }

    fireEvent.click(card);

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

    expect(screen.getByRole("status", { name: "Loading quotation table" })).toBeTruthy();
    expect(screen.getAllByRole("status", { name: "Loading quotation card" })).toHaveLength(5);
  });

  it("renders error message on error", () => {
    const props = createProps({ errorMessage: "Failed to fetch", paginatedData: [] });
    render(<MemoryRouter><QuotationComponent {...props} /></MemoryRouter>);

    expect(screen.getAllByText("Failed to fetch").length).toBeGreaterThan(0);
  });
});
