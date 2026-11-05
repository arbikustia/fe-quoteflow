import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@/libs/unit-test";
import { MemoryRouter } from "react-router-dom";

import { QuotationDetailComponent } from "./QuotationDetail.component";

import type { ApiQuotation, QuotationDetailState } from "../Quotation.type";

const mockGenerateQuotationPDF = jest.fn();
jest.mock("@/utils/pdfGenerator", () => ({
  generateQuotationPDF: (...args: unknown[]) => mockGenerateQuotationPDF(...args),
}));

jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

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
    order_type_id: "order-type-1",
    order_type_name: "Delivery",
    customer_name: "PT Example",
    customer_phone: "0812345678",
    address: "Jakarta",
    event_name: "Annual Gala",
    start_at: "2026-12-01T08:00:00.000Z",
    end_at: "2026-12-02T18:00:00.000Z",
    subtotal: 1000000,
    service_fee: 100000,
    discount: 5,
    grand_total: 1050000,
    status: 1,
    created_at: "2026-10-27T14:03:28.926Z",
    updated_at: "2026-10-28T14:03:28.926Z",
    rental_transaction_items: [{ item_id: "item-1", item_name: "Speaker", qty: 2, price: 250000, subtotal: 500000, remark: "Main hall" }],
    rental_transaction_project: [{ id: "project-1", name: "Audio Package", remark: "Complete set", price: 500000, qty: 1, subtotal: 500000, items: [{ id: "project-item-1", item_id: "item-2", item_name: "Mixer", category_name: "Audio", qty: 1, price: 500000 }] }],
    rental_handovers: [],
    customer: { id: "customer-1", name: "Master Customer", address: "Master Address", phone_number: "0800000000", status: 1, created_at: "2026-01-01", updated_at: "2026-01-02" },
    pic: { id: "pic-1", name: "Sinta", status: 1, created_at: "2026-01-01", updated_at: "2026-01-02" },
    voucher: { id: "voucher-1", name: "October Promo", code: "OCT10", discount_percent: 10, status: 1, created_at: "2026-01-01", updated_at: "2026-01-02" },
  },
};

const createProps = (quotation: ApiQuotation | null = QUOTATION): QuotationDetailState => ({
  quotation,
  itemCategories: new Map([["item-1", "Audio System"]]),
  isLoading: false,
  isApproving: false,
  isConfirmOpen: false,
  errorMessage: null,
  goBack: jest.fn(),
  openApproveModal: jest.fn(),
  closeApproveModal: jest.fn(),
  handleEdit: jest.fn(),
  handleApprove: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
});

describe("QuotationDetailComponent", () => {
  it("should render all quotation response sections", (): void => {
    render(<MemoryRouter><QuotationDetailComponent {...createProps()} /></MemoryRouter>);

    expect(screen.getAllByText("QUO-001").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Annual Gala").length).toBeGreaterThan(0);
    expect(screen.getAllByText("PT Example").length).toBeGreaterThan(0);
    expect(screen.queryByRole("heading", { name: "Customer" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "PIC" })).toBeNull();
    expect(screen.getAllByText("Quotation Created").length).toBeGreaterThan(0);
    expect(screen.queryByText("Expired At")).toBeNull();
    const quotationSection = screen.getAllByText("Quotation").find((element) => element.tagName === "P")?.closest("section");
    expect(quotationSection?.querySelector("dl")?.className).toContain("sm:grid-cols-3");
    const updatedAtField = screen.getByText("Updated At").closest("div");
    expect(updatedAtField?.parentElement?.className).toContain("[&>div:last-child]:!border-b");
    expect(screen.getAllByTestId("quotation-detail-actions")).toHaveLength(2);
    expect(screen.getAllByTestId("quotation-detail-desktop-actions")).toHaveLength(2);
    expect(screen.getAllByTestId("quotation-detail-desktop-actions")[0].className).toContain("lg:flex");
    expect(screen.getAllByText("REGULER").length).toBeGreaterThan(0);
    expect(screen.getByText("Order Type")).toBeTruthy();
    expect(screen.getByText("Delivery")).toBeTruthy();
    expect(screen.getByText("Transaction Status")).toBeTruthy();
    expect(screen.getAllByText("Speaker").length).toBeGreaterThan(0);
    expect(screen.getByText("Main hall")).toBeTruthy();
    expect(screen.queryByText("Global Remark")).toBeNull();
    expect(screen.getByRole("heading", { name: "Remark" })).toBeTruthy();
    expect(screen.getByText("Valid for thirty days")).toBeTruthy();
    const itemRemark = screen.getByText("Main hall").closest("p");
    expect(itemRemark?.textContent).toBe("Remark: Main hall");
    const qtyElement = screen.getByText("Qty: 2");
    expect(qtyElement.className).not.toContain("bg-action-primary-subtle");
    expect(qtyElement.className).toContain("text-lg");
    expect(screen.queryByText("Audio Package")).toBeNull();
    expect(screen.getAllByText("PIC").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sinta").length).toBeGreaterThan(0);
    expect(screen.queryByText("Person in Charge")).toBeNull();
    expect(screen.getAllByText("October Promo").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Discount").length).toBeGreaterThan(0);
    expect(screen.getByText("Rp 50.000 (5%)")).toBeTruthy();
    expect(screen.getByText("Discount Percent")).toBeTruthy();
    expect(screen.getByText("OCT10")).toBeTruthy();
    const voucherSection = screen.getByRole("heading", { name: "Voucher" }).closest("section");
    expect(voucherSection?.querySelector("dl")?.className).toContain("sm:grid-cols-3");
    expect(voucherSection?.textContent).not.toContain("Status");
    expect(voucherSection?.textContent).not.toContain("Created At");
    expect(voucherSection?.textContent).not.toContain("Updated At");
    expect(screen.queryByText("Rental Handovers")).toBeNull();
    expect(screen.queryByText("No rental handovers.")).toBeNull();
    expect(screen.queryByText("quotation-1")).toBeNull();
    expect(screen.queryByText("transaction-1")).toBeNull();
    expect(screen.queryByText("item-1")).toBeNull();
    expect(screen.queryByText("project-1")).toBeNull();
    expect(screen.queryByText("project-item-1 · item-2")).toBeNull();
    const transactionSection = screen.getByText("Transaction & Event").closest("section");
    expect(transactionSection?.textContent).not.toContain("Created At");
    expect(transactionSection?.textContent).not.toContain("Updated At");
    const rentalSection = screen.getByText("Rental Items").closest("section");
    expect(transactionSection?.className).toContain("rounded-3xl");
    expect(rentalSection?.className).toContain("rounded-3xl");
    expect(transactionSection?.parentElement?.className).toContain("xl:[&_dl]:grid-cols-4");
    expect(rentalSection?.parentElement?.parentElement?.className).toContain("lg:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]");
    const moreOptionsButtons = screen.getAllByTestId("quotation-detail-actions");
    expect(moreOptionsButtons[0].className).toContain("rounded-3xl");
  });

  it("should close the actions menu when clicking outside", (): void => {
    render(<MemoryRouter><QuotationDetailComponent {...createProps()} /></MemoryRouter>);
    const trigger = screen.getAllByTestId("quotation-detail-actions")[0];
    const details = trigger.closest("details");

    fireEvent.click(trigger);
    expect(details?.hasAttribute("open")).toBe(true);
    fireEvent.mouseDown(screen.getAllByText("Quotation Detail")[0]);
    expect(details?.hasAttribute("open")).toBe(false);
  });

  it("should render rental projects only for project service", (): void => {
    const projectQuotation: ApiQuotation = {
      ...QUOTATION,
      transaction: { ...QUOTATION.transaction, service_type_name: "PROJECT" },
    };

    render(<MemoryRouter><QuotationDetailComponent {...createProps(projectQuotation)} /></MemoryRouter>);

    expect(screen.getAllByText("PROJECT").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Audio Package").length).toBeGreaterThan(0);
    const projectSection = screen.getByText("Rental Projects").closest("section");
    expect(projectSection?.textContent).not.toContain("Qty: 1 · Price:");
    expect(screen.getByText("Category: Audio")).toBeTruthy();
    expect(screen.queryByText("Speaker")).toBeNull();
  });

  it("should render responsive detail sections while loading", (): void => {
    render(<MemoryRouter><QuotationDetailComponent {...{ ...createProps(null), isLoading: true }} /></MemoryRouter>);

    const skeleton = screen.getByRole("status", { name: "Loading quotation detail" });
    expect(skeleton.querySelectorAll("section")).toHaveLength(6);
    expect(skeleton.querySelector("aside")).not.toBeNull();
    expect(skeleton.querySelector(".sm\\:grid-cols-2")).not.toBeNull();
    expect(skeleton.querySelector('[aria-label="Loading pricing summary"]')).not.toBeNull();
    const transactionSkeleton = skeleton.querySelector('[aria-label="Loading transaction and event"]');
    expect(transactionSkeleton?.querySelector(".xl\\:grid-cols-4")).not.toBeNull();
    expect(transactionSkeleton?.nextElementSibling?.nextElementSibling?.className).toContain("lg:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]");
    expect(screen.queryByText("QUO-001")).toBeNull();
    expect(screen.queryByText("Quotation detail is unavailable.")).toBeNull();
  });

  it("should disable approved quotation action", (): void => {
    render(<MemoryRouter><QuotationDetailComponent {...createProps({ ...QUOTATION, status: 2 })} /></MemoryRouter>);

    expect(screen.queryByRole("menuitem", { name: "Edit" })).toBeNull();
    const approvedButtons = screen.getAllByRole("button", { name: "Approved" });
    const approvedMenuItems = screen.getAllByRole("menuitem", { name: "Approved" });
    expect(approvedButtons).toHaveLength(2);
    expect(approvedMenuItems).toHaveLength(2);
    [...approvedButtons, ...approvedMenuItems].forEach((button) => expect(button.hasAttribute("disabled")).toBe(true));
    expect(screen.getAllByRole("menuitem", { name: "Download PDF" })).toHaveLength(2);
  });

  it("should render unavailable state", (): void => {
    render(<MemoryRouter><QuotationDetailComponent {...createProps(null)} /></MemoryRouter>);

    expect(screen.getByText("Quotation detail is unavailable.")).toBeTruthy();
  });

  it("should trigger download PDF when clicked from options menu", (): void => {
    render(<MemoryRouter><QuotationDetailComponent {...createProps()} /></MemoryRouter>);

    const downloadButtons = screen.getAllByRole("menuitem", { name: /Download PDF/i });
    expect(downloadButtons.length).toBeGreaterThan(0);

    fireEvent.click(downloadButtons[0]);
    expect(mockGenerateQuotationPDF).toHaveBeenCalled();
  });
});
