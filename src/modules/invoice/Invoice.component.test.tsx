import { fireEvent, render, screen } from "@/libs/unit-test";

import { InvoiceComponent } from "./Invoice.component";
import type { InvoiceProps } from "./Invoice.type";

const mockGenerateInvoicePDF = jest.fn();
jest.mock("@/utils/pdfGenerator", () => ({
  generateInvoicePDF: (...args: unknown[]) => mockGenerateInvoicePDF(...args),
}));

jest.mock("@/app/layout", () => ({ children }: { children: React.ReactNode }): React.ReactElement => <div>{children}</div>);

const props: InvoiceProps = {
  currentPage: 1,
  pageSize: 10,
  paginatedData: [{ id: "invoice-1", transactionId: "transaction-1", invoiceNumber: "INV-001", invoiceDate: "2026-11-20T12:00:00", dueDate: "2026-11-27T12:00:00", customerName: "PT Example", name: "Annual Gala", customerPhone: "0812345678", location: "Jakarta", startDate: "2026-11-20T12:00:00", endDate: "2026-11-21T15:30:00", grandTotal: 1050000, status: 1, notes: "Invoice" }],
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
    expect(screen.getAllByText("20 November 2026 12:00").length).toBeGreaterThan(0);
    expect(screen.getByText("21 November 2026 15:30")).toBeInTheDocument();
    expect(screen.getByText("20 November 2026 12:00 – 21 November 2026 15:30")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Status" })).toBeInTheDocument();
    expect(screen.getAllByText("Invoice Created").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("Edit invoice").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("Download PDF").length).toBeGreaterThan(0);
  });

  it("should trigger download PDF when clicked in invoice table", () => {
    render(<InvoiceComponent {...props} />);

    const downloadButtons = screen.getAllByLabelText("Download PDF");
    expect(downloadButtons[0]).toHaveClass("rounded-3xl");
    const editButtons = screen.getAllByLabelText("Edit invoice");
    expect(editButtons[0]).toHaveClass("rounded-3xl");
    fireEvent.click(downloadButtons[0]);

    expect(mockGenerateInvoicePDF).toHaveBeenCalled();
  });

  it("should render approved status and hide edit action", () => {
    render(<InvoiceComponent {...props} paginatedData={[{ ...props.paginatedData[0], status: 2 }]} />);

    const badge = screen.getAllByText("Approved")[0];
    expect(badge).toHaveClass("border-current", "text-base", "uppercase");
    expect(screen.queryByRole("button", { name: "Edit invoice" })).toBeNull();
    expect(screen.getByRole("button", { name: "View invoice detail" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Download PDF" })).toBeTruthy();
  });

  it("should open invoice detail from mobile card", () => {
    render(<InvoiceComponent {...props} />);

    const card = screen.getByRole("button", { name: /INV-001.*Invoice Created.*Annual Gala/s });
    expect(card).toHaveClass("rounded-3xl");
    expect(card).toHaveClass("border-border-strong");
    expect(card.querySelector(".rounded-full")).toHaveClass("border-current", "text-base", "uppercase");
    expect(card.querySelectorAll(".text-xs, .text-sm")).toHaveLength(0);
    expect(card).toHaveTextContent("Event");
    expect(card).toHaveTextContent("Customer");
    expect(card).toHaveTextContent("Event period");
    expect(card).toHaveTextContent("Total");
    expect(screen.getAllByText("INV-001")[0]).toHaveClass("text-lg");
    fireEvent.click(card);

    expect(props.onRowClick).toHaveBeenCalledWith(props.paginatedData[0]);
  });

  it("should handle view detail and edit invoice action click", () => {
    render(<InvoiceComponent {...props} />);

    const detailButtons = screen.getAllByRole("button", { name: "View invoice detail" });
    expect(detailButtons.length).toBeGreaterThan(0);
    expect(detailButtons[0]).toHaveClass("rounded-3xl");
    fireEvent.click(detailButtons[0]);
    expect(props.onDetail).toHaveBeenCalledWith(props.paginatedData[0]);

    const editButtons = screen.getAllByRole("button", { name: "Edit invoice" });
    expect(editButtons.length).toBeGreaterThan(0);
    expect(editButtons[0]).toHaveClass("rounded-3xl");
    fireEvent.click(editButtons[0]);
    expect(props.onEdit).toHaveBeenCalledWith(props.paginatedData[0]);
  });

  it("should render matching mobile and desktop loading skeletons", () => {
    render(<InvoiceComponent {...props} isLoading={true} paginatedData={[]} />);

    const table = screen.getByRole("status", { name: "Loading invoice table" });
    expect(table.querySelectorAll("th")).toHaveLength(9);
    expect(table.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(table.querySelectorAll("tbody tr:first-child td")).toHaveLength(9);
    expect(table.querySelectorAll("tbody tr:first-child td:last-child span")).toHaveLength(3);
    const cardSkeletons = screen.getAllByRole("status", { name: "Loading invoice card" });
    expect(cardSkeletons).toHaveLength(5);
    expect(cardSkeletons[0]).toHaveClass("rounded-3xl");
    expect(cardSkeletons[0].querySelectorAll(".border-t")).toHaveLength(2);
  });

  it("should render empty invoice state", () => {
    render(<InvoiceComponent {...props} paginatedData={[]} isEmpty={true} totalCount={0} totalPages={0} />);

    expect(screen.getAllByText("No invoices found.")).toHaveLength(2);
  });
});
