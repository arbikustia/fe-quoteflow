import { describe, expect, it, jest } from "@jest/globals";

import { fireEvent, render, screen } from "@/libs/unit-test";

import { PaymentCreateComponent } from "./PaymentCreate.component";
import type { PaymentCreateFormState } from "../Payment.type";

const createProps = (): PaymentCreateFormState => ({
  invoices: [{ id: "inv-1", invoice_no: "INV-001" }],
  paymentMethods: [{ id: "pm-1", name: "Bank Transfer" }],
  invoiceId: "inv-1",
  paymentMethodId: "pm-1",
  status: "1",
  amount: 1500000,
  paidAt: "2026-11-01T00:00:00.000Z",
  referenceNo: "REF-001",
  notes: "Test notes",
  isLoadingOptions: false,
  isSubmitting: false,
  errorMessage: null,
  isSubmitted: false,
  isEditMode: false,
  isActive: true,
  handleSubmit: jest.fn<PaymentCreateFormState["handleSubmit"]>(async (event) => { event.preventDefault(); }),
  setInvoiceId: jest.fn(),
  setPaymentMethodId: jest.fn(),
  setStatus: jest.fn(),
  setAmount: jest.fn(),
  setPaidAt: jest.fn(),
  setReferenceNo: jest.fn(),
  setNotes: jest.fn(),
  handleStatusChange: jest.fn(),
  goBack: jest.fn(),
});

describe("PaymentCreateComponent", () => {
  it("should render all payment fields and submit button", () => {
    const props = createProps();
    const { container } = render(<PaymentCreateComponent {...props} />);

    expect(screen.getByText("Invoice")).toBeTruthy();
    expect(screen.getByText("Payment Method")).toBeTruthy();
    expect(screen.getByText("Payment Status")).toBeTruthy();
    expect(screen.getByText("Amount")).toBeTruthy();
    expect(screen.getByText("Paid At")).toBeTruthy();
    expect(screen.queryByText("Reference No")).toBeNull();
    expect(screen.getByText("Notes")).toBeTruthy();
    expect(screen.getByText("Payment Information")).toBeTruthy();
    expect(screen.getByText("Information")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Create Payment" })).toBeTruthy();

    const form = container.querySelector("form");
    expect(form?.classList.contains("rounded-3xl")).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(props.goBack).toHaveBeenCalledTimes(1);
  });

  it("should match payment list title and subtitle typography", () => {
    const { container } = render(<PaymentCreateComponent {...createProps()} />);
    const titles = container.querySelectorAll("h2");
    const subtitles = screen.getAllByText("Manage document payments and status");

    expect(titles).toHaveLength(2);
    titles.forEach((title) => {
      expect(title.classList.contains("text-4xl")).toBe(true);
      expect(title.classList.contains("font-semibold")).toBe(true);
      expect(title.classList.contains("tracking-tight")).toBe(true);
    });
    expect(subtitles).toHaveLength(2);
    subtitles.forEach((subtitle) => {
      expect(subtitle.classList.contains("text-sm")).toBe(true);
    });
  });

  it("should submit form using provided handler", () => {
    const props = createProps();
    render(<PaymentCreateComponent {...props} />);

    fireEvent.submit(screen.getByRole("button", { name: "Create Payment" }).closest("form")!);
    expect(props.handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("should show red border when payment status is empty after submit", () => {
    const props = { ...createProps(), status: "", isSubmitted: true };
    const { container } = render(<PaymentCreateComponent {...props} />);
    const status = container.querySelector("#payment-status-select");

    expect(screen.getByText("Payment status is required.")).toBeTruthy();
    expect(status?.getAttribute("aria-invalid")).toBe("true");
    expect(status?.closest(".ant-select")?.className).toContain("!border-danger");
    expect(status?.closest(".ant-select")?.getAttribute("style")).toContain("rgb(220, 38, 38)");
  });

  it("should render status toggle when in edit mode", () => {
    const props = { ...createProps(), isEditMode: true };
    render(<PaymentCreateComponent {...props} />);

    expect(screen.getByText("Status")).toBeTruthy();
    expect(screen.getByText("active").className).toContain("border-current");
    expect(screen.getByText("Toggle active or inactive status")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Cancel" }).className).toContain("h-14");
    expect(screen.getByRole("button", { name: "Update Payment" }).className).toContain("rounded-xl");
  });
});
