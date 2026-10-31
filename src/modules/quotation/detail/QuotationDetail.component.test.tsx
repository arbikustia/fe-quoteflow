import { describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@/libs/unit-test";
import { MemoryRouter } from "react-router-dom";

import { QuotationDetailComponent } from "./QuotationDetail.component";

import type { ApiQuotation, QuotationDetailState } from "../Quotation.type";

const QUOTATION: ApiQuotation = {
  id: "quotation-1",
  transaction_id: "transaction-1",
  quotation_no: "QUO-001",
  quotation_date: "2026-10-27T14:03:28.926Z",
  expired_at: "2026-11-27T14:03:28.926Z",
  notes: "Valid for thirty days",
  status: 1,
  created_at: "2026-10-27T14:03:28.926Z",
  updated_at: "2026-10-28T14:03:28.926Z",
  transaction: {
    id: "transaction-1",
    service_type_id: "service-1",
    service_type_name: "REGULER",
    customer_name: "PT Example",
    customer_phone: "0812345678",
    address: "Jakarta",
    event_name: "Annual Gala",
    start_at: "2026-12-01T08:00:00.000Z",
    end_at: "2026-12-02T18:00:00.000Z",
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
    pic: { id: "pic-1", name: "Sinta", status: 1, created_at: "2026-01-01", updated_at: "2026-01-02" },
    voucher: { id: "voucher-1", name: "October Promo", code: "OCT10", discount_percent: 10, status: 1, created_at: "2026-01-01", updated_at: "2026-01-02" },
  },
};

const createProps = (quotation: ApiQuotation | null = QUOTATION): QuotationDetailState => ({
  quotation,
  isLoading: false,
  isApproving: false,
  isConfirmOpen: false,
  errorMessage: null,
  goBack: jest.fn(),
  openApproveModal: jest.fn(),
  closeApproveModal: jest.fn(),
  handleApprove: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
});

describe("QuotationDetailComponent", () => {
  it("should render all quotation response sections", (): void => {
    render(<MemoryRouter><QuotationDetailComponent {...createProps()} /></MemoryRouter>);

    expect(screen.getAllByText("QUO-001").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Annual Gala").length).toBeGreaterThan(0);
    expect(screen.getAllByText("QUOTATION SENT").length).toBeGreaterThan(0);
    expect(screen.getAllByText("REGULER").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Speaker").length).toBeGreaterThan(0);
    expect(screen.queryByText("Audio Package")).toBeNull();
    expect(screen.getAllByText("PIC").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sinta").length).toBeGreaterThan(0);
    expect(screen.queryByText("Person in Charge")).toBeNull();
    expect(screen.getAllByText("October Promo").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Discount").length).toBeGreaterThan(0);
    expect(screen.queryByText("Discount Percent")).toBeNull();
    expect(screen.queryByText("OCT10")).toBeNull();
    expect(screen.queryByText("quotation-1")).toBeNull();
    expect(screen.queryByText("transaction-1")).toBeNull();
    expect(screen.queryByText("item-1")).toBeNull();
    expect(screen.queryByText("project-1")).toBeNull();
    expect(screen.queryByText("project-item-1 · item-2")).toBeNull();
  });

  it("should render rental projects only for project service", (): void => {
    const projectQuotation: ApiQuotation = {
      ...QUOTATION,
      transaction: { ...QUOTATION.transaction, service_type_name: "PROJECT" },
    };

    render(<MemoryRouter><QuotationDetailComponent {...createProps(projectQuotation)} /></MemoryRouter>);

    expect(screen.getAllByText("PROJECT").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Audio Package").length).toBeGreaterThan(0);
    expect(screen.queryByText("Speaker")).toBeNull();
  });

  it("should render unavailable state", (): void => {
    render(<MemoryRouter><QuotationDetailComponent {...createProps(null)} /></MemoryRouter>);

    expect(screen.getByText("Quotation detail is unavailable.")).toBeTruthy();
  });
});
