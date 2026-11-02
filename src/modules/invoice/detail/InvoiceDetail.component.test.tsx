import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@/libs/unit-test";
import { MemoryRouter } from "react-router-dom";

import { InvoiceDetailComponent } from "./InvoiceDetail.component";

import type { ApiInvoice, InvoiceDetailState } from "../Invoice.type";

const mockGenerateInvoicePDF = jest.fn();
jest.mock("@/utils/pdfGenerator", () => ({
  generateInvoicePDF: (...args: unknown[]) => mockGenerateInvoicePDF(...args),
}));

const INVOICE: ApiInvoice = {
  id: "invoice-1",
  transaction_id: "invoice-transaction-1",
  invoice_no: "INV-001",
  invoice_date: "2026-10-27",
  due_date: "2026-11-27",
  notes: "Invoice generated from QUO-001",
  status: 1,
  created_at: "2026-10-27T14:03:28.926Z",
  updated_at: "2026-10-28T14:03:28.926Z",
  quotation: {
    id: "quotation-1",
    transaction_id: "invoice-transaction-1",
    quotation_no: "QUO-001",
    quotation_date: "2026-10-27",
    expired_at: "2026-11-27",
    notes: "Valid for thirty days",
    status: 2,
    created_at: "2026-10-27T14:03:28.926Z",
    updated_at: "2026-10-28T14:03:28.926Z",
    transaction: {
      id: "invoice-transaction-1",
      service_type_id: "service-1",
      service_type_name: "REGULER",
      customer_name: "PT Example",
      customer_phone: "0812345678",
      address: "Jakarta",
      event_name: "Annual Gala",
      start_at: "2026-12-01",
      end_at: "2026-12-02",
      subtotal: 1000000,
      service_fee: 100000,
      discount: 50000,
      grand_total: 1050000,
      status: 1,
      created_at: "2026-10-27T14:03:28.926Z",
      updated_at: "2026-10-28T14:03:28.926Z",
      rental_transaction_items: [{ item_id: "item-1", item_name: "Speaker", qty: 2, price: 250000, subtotal: 500000, remark: "Main hall" }],
      rental_transaction_project: [{ id: "project-1", name: "Audio Package", remark: "Complete set", qty: 1, subtotal: 500000, items: [{ id: "project-item-1", item_id: "item-2", item_name: "Mixer", qty: 1, price: 500000 }] }],
      customer: { id: "customer-1", name: "PT Example", address: "Jakarta", phone_number: "0812345678", status: 1, created_at: "2026-01-01", updated_at: "2026-01-02" },
      pic: { id: "pic-1", name: "Sinta", address: "", phone_number: "", status: 1, created_at: "2026-01-01", updated_at: "2026-01-02" },
      voucher: { id: "voucher-1", name: "October Promo", address: "", phone_number: "", code: "OCT10", discount_percent: 10, status: 1, created_at: "2026-01-01", updated_at: "2026-01-02" },
    },
  },
};

const createProps = (invoice: ApiInvoice | null = INVOICE): InvoiceDetailState => ({
  invoice,
  isLoading: false,
  isApproving: false,
  isConfirmOpen: false,
  errorMessage: null,
  goBack: jest.fn(),
  goEdit: jest.fn(),
  handleEdit: jest.fn(),
  openApproveModal: jest.fn(),
  closeApproveModal: jest.fn(),
  handleApprove: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
});

describe("InvoiceDetailComponent", () => {
  it("should render all invoice response sections", (): void => {
    render(
      <MemoryRouter>
        <InvoiceDetailComponent {...createProps()} />
      </MemoryRouter>,
    );

    expect(screen.getAllByText("INV-001").length).toBeGreaterThan(0);
    expect(screen.getAllByText("QUO-001").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Annual Gala").length).toBeGreaterThan(0);
    expect(screen.getAllByText("REGULER").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("invoice-detail-actions")).toHaveLength(2);
    expect(screen.getAllByRole("menuitem", { name: "Edit" })).toHaveLength(2);
    expect(screen.getAllByRole("menuitem", { name: "Approve" })).toHaveLength(2);
    expect(screen.getAllByText("Invoice Created").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Speaker").length).toBeGreaterThan(0);
    expect(screen.queryByText("Audio Package")).toBeNull();
    expect(screen.getAllByText("PIC").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sinta").length).toBeGreaterThan(0);
    expect(screen.queryByText("Person in Charge")).toBeNull();
    expect(screen.getAllByText("October Promo").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Discount").length).toBeGreaterThan(0);
    expect(screen.queryByText("Discount Percent")).toBeNull();
    expect(screen.queryByText("OCT10")).toBeNull();
    expect(screen.queryByText("invoice-1")).toBeNull();
    expect(screen.queryByText("invoice-transaction-1")).toBeNull();
    expect(screen.queryByText("item-1")).toBeNull();
    expect(screen.queryByText("project-1")).toBeNull();
  });

  it("should render rental projects only for project service", (): void => {
    const projectInvoice: ApiInvoice = {
      ...INVOICE,
      quotation: {
        ...INVOICE.quotation,
        transaction: {
          ...INVOICE.quotation.transaction,
          service_type_name: "PROJECT",
        },
      },
    };

    render(
      <MemoryRouter>
        <InvoiceDetailComponent {...createProps(projectInvoice)} />
      </MemoryRouter>,
    );

    expect(screen.getAllByText("PROJECT").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Audio Package").length).toBeGreaterThan(0);
    expect(screen.queryByText("Speaker")).toBeNull();
  });

  it("should render unavailable state", (): void => {
    render(
      <MemoryRouter>
        <InvoiceDetailComponent {...createProps(null)} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Invoice detail is unavailable.")).toBeTruthy();
  });

  it("should trigger download PDF when clicked from options menu", (): void => {
    render(
      <MemoryRouter>
        <InvoiceDetailComponent {...createProps()} />
      </MemoryRouter>,
    );

    const downloadButtons = screen.getAllByRole("menuitem", { name: /Download PDF/i });
    expect(downloadButtons.length).toBeGreaterThan(0);

    fireEvent.click(downloadButtons[0]);
    expect(mockGenerateInvoicePDF).toHaveBeenCalled();
  });
});
