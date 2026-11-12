import { fireEvent, render, screen } from "@/libs/unit-test";

import { PaymentMobileCard } from "./Payment.helper";
import type { PaymentData } from "./Payment.type";

const payment: PaymentData = {
  id: "p1", invoiceId: "i1", paymentMethodId: "pm", invoiceNo: "INV-1", customerName: "Ade", amount: 1000,
  paidAt: "2026-11-01T08:00:00", referenceNo: "", notes: "", status: "active", statusLabel: "", grandTotal: 2000, remainingAmount: 1000, createdAt: "",
};

describe("PaymentMobileCard", (): void => {
  it("should render invoice, customer and unpaid fallback label", (): void => {
    render(<PaymentMobileCard payment={payment} onClick={jest.fn()} />);

    expect(screen.getByText("INV-1")).toBeTruthy();
    expect(screen.getByText("Ade")).toBeTruthy();
    expect(screen.getByText("Unpaid").className).toContain("bg-warning-subtle");
  });

  it("should render paid fallback label when nothing remains", (): void => {
    render(<PaymentMobileCard payment={{ ...payment, remainingAmount: 0 }} onClick={jest.fn()} />);

    expect(screen.getByText("Paid").className).toContain("bg-success-subtle");
  });

  it("should call onClick with the payment when clicked", (): void => {
    const onClick = jest.fn();

    render(<PaymentMobileCard payment={payment} onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledWith(payment);
  });
});
