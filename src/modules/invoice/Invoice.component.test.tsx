import { render, screen } from "@testing-library/react";

import { InvoiceComponent } from "./Invoice.component";
import type { InvoiceProps } from "./Invoice.type";

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div>{children}</div>);

const props: InvoiceProps = {
  currentPage: 1,
  pageSize: 10,
  paginatedData: [{ id: "invoice-1", transactionId: "transaction-1", invoiceNumber: "INV-001", invoiceDate: "2026-10-27", dueDate: "2026-11-27", customerName: "PT Example", name: "Annual Gala", customerPhone: "0812345678", location: "Jakarta", startDate: "2026-12-01", endDate: "2026-12-02", grandTotal: 1050000, status: 1, notes: "Invoice" }],
  totalPages: 1,
  totalCount: 1,
  isLoading: false,
  isEmpty: false,
  errorMessage: null,
  setSearchTerm: jest.fn(),
  goToPage: jest.fn(),
  changePageSize: jest.fn(),
  onBack: jest.fn(),
  onRowClick: jest.fn(),
  onDetail: jest.fn(),
  onEdit: jest.fn(),
};

describe("InvoiceComponent", () => {
  it("should render invoice fields like quotation", () => {
    render(<InvoiceComponent {...props} />);

    expect(screen.getAllByText("INV-001").length).toBeGreaterThan(0);
    expect(screen.getAllByText("PT Example").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Annual Gala").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Active").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("Edit invoice").length).toBeGreaterThan(0);
  });

  it("should render inactive top-level invoice status", () => {
    render(<InvoiceComponent {...props} paginatedData={[{ ...props.paginatedData[0], status: 0 }]} />);

    expect(screen.getAllByText("Inactive").length).toBeGreaterThan(0);
  });

  it("should render empty invoice state", () => {
    render(<InvoiceComponent {...props} paginatedData={[]} isEmpty={true} totalCount={0} totalPages={0} />);

    expect(screen.getAllByText("No invoices found.")).toHaveLength(2);
  });
});
