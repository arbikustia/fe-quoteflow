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
  invoiceId: "inv-1",
  quotationId: "quo-1",
  invoiceNo: "INV-001",
  notes: "Order note",
  rawOrderDate: "2026-11-01T01:32:01.000Z",
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
    onEditStatus: jest.fn(),
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

  it("should show Order Report title and quotation-style card on mobile", () => {
    const { container } = render(
      <BrowserRouter>
        <ReportOrderComponent {...mockProps} />
      </BrowserRouter>,
    );
    const mobileTitle = container.querySelector(".lg\\:hidden h1");
    const desktopTitle = container.querySelector(".lg\\:flex h1");
    const card = container.querySelector(".lg\\:hidden button.group");

    expect(mobileTitle?.textContent).toBe("Order Report");
    expect(desktopTitle?.textContent).toBe("Order Report");
    expect(card?.classList.contains("bg-background-surface")).toBe(true);
    expect(card?.querySelector(".text-xs, .text-sm, .text-base")).toBeNull();
    expect(card?.querySelector(".border-t")?.textContent).toContain("Total");
    expect(card?.textContent).toContain("Resepsi12");
    expect(card?.textContent).toContain("Arbi");
  });

  it("should open status form from desktop edit icon and mobile card", () => {
    render(
      <BrowserRouter>
        <ReportOrderComponent {...mockProps} />
      </BrowserRouter>,
    );

    screen.getByRole("button", { name: "Edit order status" }).click();
    expect(mockProps.onEditStatus).toHaveBeenCalledWith(MOCK_ORDER);

    const mobileCard = screen.getAllByRole("button").find((button) => button.textContent?.includes("ORDER-001") && button.textContent?.includes("Resepsi12"));
    mobileCard?.click();
    expect(mockProps.onEditStatus).toHaveBeenCalledTimes(2);
  });

  it("renders loading state", () => {
    render(
      <BrowserRouter>
        <ReportOrderComponent {...mockProps} isLoading={true} />
      </BrowserRouter>,
    );

    expect(screen.getByRole("status", { name: "Loading" })).toBeTruthy();
    expect(screen.getAllByRole("status", { name: "Loading order report card" })).toHaveLength(5);
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
