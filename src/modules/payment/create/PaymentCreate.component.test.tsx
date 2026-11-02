import { describe, expect, it, jest } from "@jest/globals";

import { fireEvent, render, screen } from "@/libs/unit-test";

import { PaymentCreateComponent } from "./PaymentCreate.component";
import type { PaymentCreateFormState } from "../Payment.type";

const createProps = (): PaymentCreateFormState => ({
  invoices: [{ id: "inv-1", invoice_no: "INV-001" }],
  paymentMethods: [{ id: "pm-1", name: "Bank Transfer" }],
  invoiceId: "inv-1",
  paymentMethodId: "pm-1",
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
  setAmount: jest.fn(),
  setPaidAt: jest.fn(),
  setReferenceNo: jest.fn(),
  setNotes: jest.fn(),
  handleStatusChange: jest.fn(),
  goBack: jest.fn(),
});

describe("PaymentCreateComponent", () => {
  it("should render all payment fields and submit button", () => {
    render(<PaymentCreateComponent {...createProps()} />);

    expect(screen.getByText("Invoice")).toBeTruthy();
    expect(screen.getByText("Payment Method")).toBeTruthy();
    expect(screen.getByText("Amount")).toBeTruthy();
    expect(screen.getByText("Paid At")).toBeTruthy();
    expect(screen.queryByText("Reference No")).toBeNull();
    expect(screen.getByText("Notes")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Create Payment" })).toBeTruthy();
  });

  it("should match payment form title typography on mobile and desktop", () => {
    const { container } = render(<PaymentCreateComponent {...createProps()} />);
    const titles = container.querySelectorAll("h2");

    expect(titles).toHaveLength(2);
    titles.forEach((title) => {
      expect(title.classList.contains("text-4xl")).toBe(true);
      expect(title.classList.contains("font-semibold")).toBe(true);
      expect(title.classList.contains("tracking-tight")).toBe(true);
    });
  });

  it("should submit form using provided handler", () => {
    const props = createProps();
    render(<PaymentCreateComponent {...props} />);

    fireEvent.submit(screen.getByRole("button", { name: "Create Payment" }).closest("form")!);
    expect(props.handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("should render status toggle when in edit mode", () => {
    const props = { ...createProps(), isEditMode: true };
    render(<PaymentCreateComponent {...props} />);

    expect(screen.getByText("Status")).toBeTruthy();
    expect(screen.getByText("Toggle active or inactive status")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Update Payment" })).toBeTruthy();
  });
});
