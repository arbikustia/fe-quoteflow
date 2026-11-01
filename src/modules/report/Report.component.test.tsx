import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { ReportOrderComponent } from "./Report.component";
import type { ReportOrderData, ReportOrderProps } from "./Report.type";

jest.mock("@/components/Pagination", () => ({
  Pagination: () => <div data-testid="pagination" />,
}));
jest.mock("@/app/layout", () =>
  ({ children }: { children: React.ReactNode }) => <div data-testid="mock-layout">{children}</div>,
);

const MOCK_ORDER: ReportOrderData = {
  id: "ord-1",
  orderNo: "ORDER-001",
  transactionId: "tx-1",
  invoiceNo: "INV-001",
  customerName: "Arbi",
  customerPhone: "08123456",
  eventName: "Resepsi12",
  address: "Jl. Depok Raya 123",
  orderDate: "2026-11-01 01:32:01",
  startDate: "2026-10-31 06:00:00",
  endDate: "2026-11-01 06:00:00",
  grandTotal: 309990,
  status: 1,
  statusLabel: "active",
  serviceTypeName: "REGULER",
  orderTypeName: "AMBIL",
};

describe("ReportOrderComponent", () => {
  const mockProps: ReportOrderProps = {
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    paginatedData: [MOCK_ORDER],
    totalCount: 1,
    isLoading: false,
    errorMessage: null,
    isEmpty: false,
    isMissingData: false,
    goToPage: jest.fn(),
    nextPage: jest.fn(),
    prevPage: jest.fn(),
    changePageSize: jest.fn(),
    setSearchTerm: jest.fn(),
    onBack: jest.fn(),
    onRowClick: jest.fn(),
  };

  it("renders order table and cards correctly", () => {
    render(
      <BrowserRouter>
        <ReportOrderComponent {...mockProps} />
      </BrowserRouter>,
    );

    expect(screen.getAllByText("ORDER-001").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Arbi").length).toBeGreaterThan(0);
  });

  it("renders loading state", () => {
    render(
      <BrowserRouter>
        <ReportOrderComponent {...mockProps} isLoading={true} />
      </BrowserRouter>,
    );

    expect(screen.getAllByText("Loading orders…").length).toBeGreaterThan(0);
  });

  it("renders empty state", () => {
    render(
      <BrowserRouter>
        <ReportOrderComponent {...mockProps} isEmpty={true} paginatedData={[]} />
      </BrowserRouter>,
    );

    expect(screen.getAllByText("No orders found.").length).toBeGreaterThan(0);
  });
});
