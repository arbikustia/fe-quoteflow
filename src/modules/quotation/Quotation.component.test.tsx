import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@/libs/unit-test";
import { MemoryRouter } from "react-router-dom";

import { QuotationComponent } from "./Quotation.component";
import type { QuotationData, QuotationProps } from "./Quotation.type";

const mockGenerateQuotationPDF = jest.fn();
jest.mock("@/utils/pdfGenerator", () => ({
  generateQuotationPDF: (...args: unknown[]) => mockGenerateQuotationPDF(...args),
}));

jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("@/app/shared/PageLayout", () => ({
  PageLayout: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <section><h1>{title}</h1>{children}</section>
  ),
}));

const MOCK_ROWS: QuotationData[] = [
  {
    id: "q-1",
    transactionId: "tx-1",
    quotationNumber: "QUO-001",
    customerName: "PT Example",
    name: "Annual Gala",
    quotationDate: "2026-11-20T12:00:00",
    customerPhone: "0812345678",
    location: "Jakarta Convention Center",
    startDate: "2026-11-20T12:00:00",
    endDate: "2026-11-21T15:30:00",
    grandTotal: 15000000,
    status: 1,
    items: [{ item_id: "item-1", item_name: "Speaker", qty: 7, price: 500000, subtotal: 3500000, remark: "Main hall" }],
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
    itemCategories: new Map([["item-1", "Audio"]]),
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

    expect(screen.queryByRole("button", { name: /(?:create|add)\s+quotation/i })).toBeNull();
    expect(screen.getByText("Status")).toBeTruthy();
    expect(screen.getAllByText("QUO-001").length).toBeGreaterThan(0);
    expect(screen.getAllByText("PT Example").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Annual Gala").length).toBeGreaterThan(0);
    expect(screen.getAllByText("20 November 2026 12:00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("21 November 2026 15:30").length).toBeGreaterThan(0);
    expect(screen.getAllByText("20 November 2026 12:00 – 21 November 2026 15:30").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Quotation Created")).toHaveLength(2);
    expect(screen.getAllByText("Approved")).toHaveLength(2);
    expect(screen.getAllByText("Cancelled")).toHaveLength(2);
    expect(screen.getAllByText("Quotation Created")[0].className).toContain("border-current");
    expect(screen.getAllByText("Quotation Created")[0].className).toContain("text-base");
    expect(screen.getAllByText("Quotation Created")[0].className).toContain("uppercase");
    expect(screen.getAllByRole("button", { name: "Download PDF" })[0].className).toContain("rounded-3xl");
  });

  it("should show quotation workflow statuses on mobile cards", (): void => {
    const props = createProps();
    render(<MemoryRouter><QuotationComponent {...props} /></MemoryRouter>);

    const expectedStatuses = ["Quotation Created", "Approved", "Cancelled"];
    MOCK_ROWS.forEach((row, index): void => {
      const card = screen.getAllByText(row.quotationNumber)[0].closest("button");
      expect(card).not.toBeNull();
      expect(card?.className).toContain("rounded-3xl");
      expect(card?.className).toContain("border-border-strong");
      expect(card?.className).toContain("bg-background-surface");
      expect(card?.textContent).toContain(expectedStatuses[index]);
      expect(card?.textContent).toContain(row.name);
      expect(card?.textContent).toContain(row.customerName);
      expect(card?.textContent).toContain(`Rp ${row.grandTotal.toLocaleString("id-ID")}`);
      expect(card?.textContent).toContain("Event period");
      expect(card?.textContent).toContain("Total");
      expect(screen.getAllByText(row.quotationNumber)[0].className).toContain("text-lg");
      expect(card?.querySelector(".rounded-full")?.className).toContain("text-base");
      expect(card?.querySelector(".rounded-full")?.className).toContain("border-current");
      expect(screen.getAllByText(row.customerName)[0].className).toContain("text-lg");
      expect(card?.querySelectorAll(".text-xs, .text-sm")).toHaveLength(0);
      expect(card?.textContent).not.toMatch(/\bactive\b|\binactive\b/i);
    });
  });

  it("handles view detail and edit quotation action click", () => {
    const onDetail = jest.fn();
    const onEdit = jest.fn();
    const props = createProps({ onDetail, onEdit });
    render(<MemoryRouter><QuotationComponent {...props} /></MemoryRouter>);

    const detailButtons = screen.getAllByRole("button", { name: "View quotation detail" });
    expect(detailButtons.length).toBeGreaterThan(0);
    fireEvent.click(detailButtons[0]);
    expect(onDetail).toHaveBeenCalledWith(MOCK_ROWS[0]);

    const editButtons = screen.getAllByRole("button", { name: "Edit quotation" });
    expect(editButtons.length).toBeGreaterThan(0);
    fireEvent.click(editButtons[0]);
    expect(onEdit).toHaveBeenCalledWith(MOCK_ROWS[0]);
  });

  it("handles download PDF action click", () => {
    const props = createProps();
    render(<MemoryRouter><QuotationComponent {...props} /></MemoryRouter>);

    const downloadButtons = screen.getAllByRole("button", { name: "Download PDF" });
    expect(downloadButtons.length).toBeGreaterThan(0);

    fireEvent.click(downloadButtons[0]);
    expect(mockGenerateQuotationPDF).toHaveBeenCalledWith(expect.objectContaining({
      pdfItems: [expect.objectContaining({ name: "Speaker", category: "Audio", qty: 7, price: 500000, remark: "Main hall" })],
    }));
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

    const tableSkeleton = screen.getByRole("status", { name: "Loading quotation table" });
    const cardSkeletons = screen.getAllByRole("status", { name: "Loading quotation card" });
    expect(tableSkeleton.querySelectorAll("th")).toHaveLength(9);
    expect(tableSkeleton.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(tableSkeleton.querySelectorAll("tbody tr:first-child td")).toHaveLength(9);
    expect(tableSkeleton.querySelectorAll("tbody tr:first-child td:last-child span")).toHaveLength(3);
    expect(cardSkeletons).toHaveLength(5);
    expect(cardSkeletons[0].className).toContain("rounded-3xl");
    expect(cardSkeletons[0].querySelectorAll(".border-t > div")).toHaveLength(2);
    expect(screen.queryByText("QUO-001")).toBeNull();
  });

  it("renders error message on error", () => {
    const props = createProps({ errorMessage: "Failed to fetch", paginatedData: [] });
    render(<MemoryRouter><QuotationComponent {...props} /></MemoryRouter>);

    expect(screen.getAllByText("Failed to fetch").length).toBeGreaterThan(0);
  });
});
