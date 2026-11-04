import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@/libs/unit-test";
import { MemoryRouter } from "react-router-dom";

import { InvoiceDetailComponent } from "./InvoiceDetail.component";

import type { ApiInvoice, InvoiceDetailState } from "../Invoice.type";

const mockGenerateInvoicePDF = jest.fn();
jest.mock("@/utils/pdfGenerator", () => ({
  generateInvoicePDF: (...args: unknown[]) => mockGenerateInvoicePDF(...args),
}));

jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
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
      order_type_id: "order-type-1",
      order_type_name: "Delivery",
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
    expect(screen.getByText("Order Type")).toBeTruthy();
    expect(screen.getByText("Delivery")).toBeTruthy();
    expect(screen.getByText("Transaction Status")).toBeTruthy();
    expect(screen.getByText("Document Information")).toBeTruthy();
    expect(screen.getByText("Invoice generated from QUO-001")).toBeTruthy();
    expect(screen.getByText("Valid for thirty days")).toBeTruthy();
    expect(screen.getByText("Quotation Expired At")).toBeTruthy();
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
    const transactionSection = screen.getByText("Transaction & Event").closest("section");
    const rentalSection = screen.getByText("Rental Items").closest("section");
    expect(transactionSection?.className).toContain("rounded-3xl");
    expect(rentalSection?.className).toContain("rounded-3xl");
    expect(transactionSection?.parentElement?.className).toContain("xl:[&_dl]:grid-cols-4");
    expect(rentalSection?.parentElement?.parentElement?.className).toContain("lg:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]");
    const moreOptionsButtons = screen.getAllByTestId("invoice-detail-actions");
    expect(moreOptionsButtons[0].className).toContain("rounded-3xl");
    const qtyElement = screen.getByText("Qty: 2");
    expect(qtyElement.className).not.toContain("bg-action-primary-subtle");
    expect(qtyElement.className).toContain("text-lg");
  });

  it("should close the actions menu when clicking outside", (): void => {
    render(<MemoryRouter><InvoiceDetailComponent {...createProps()} /></MemoryRouter>);
    const trigger = screen.getAllByTestId("invoice-detail-actions")[0];
    const details = trigger.closest("details");

    fireEvent.click(trigger);
    expect(details?.hasAttribute("open")).toBe(true);
    fireEvent.mouseDown(screen.getAllByText("Invoice Detail")[0]);
    expect(details?.hasAttribute("open")).toBe(false);
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

  it("should render matching mobile and desktop detail loading skeleton", (): void => {
    render(
      <MemoryRouter>
        <InvoiceDetailComponent {...createProps(null)} isLoading={true} />
      </MemoryRouter>,
    );

    const skeleton = screen.getByRole("status", { name: "Loading invoice detail" });
    expect(skeleton).not.toBeNull();
    expect(skeleton.querySelectorAll("section")).toHaveLength(6);
    expect(skeleton.querySelector("aside")).not.toBeNull();
    const transactionSkeleton = skeleton.querySelector('[aria-label="Loading transaction and event"]');
    expect(transactionSkeleton?.querySelector(".xl\\:grid-cols-4")).not.toBeNull();
    expect(transactionSkeleton?.nextElementSibling?.nextElementSibling?.className).toContain("lg:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]");
    expect(skeleton.querySelector('[aria-label="Loading pricing summary"]')).not.toBeNull();
  });

  it("should keep download available without edit and approve for approved invoices", (): void => {
    render(
      <MemoryRouter>
        <InvoiceDetailComponent {...createProps({ ...INVOICE, status: 2 })} />
      </MemoryRouter>,
    );

    expect(screen.getAllByTestId("invoice-detail-actions")).toHaveLength(2);
    expect(screen.getAllByRole("menuitem", { name: "Download PDF" })).toHaveLength(2);
    expect(screen.queryByRole("menuitem", { name: "Edit" })).toBeNull();
    expect(screen.queryByRole("menuitem", { name: "Approve" })).toBeNull();
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
