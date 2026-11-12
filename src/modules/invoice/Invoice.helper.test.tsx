import { fireEvent, render, screen } from "@/libs/unit-test";

import { InvoiceMobileCard } from "./Invoice.helper";
import type { InvoiceData } from "./Invoice.type";

const invoice: InvoiceData = {
  id: "inv-1",
  transactionId: "tx-1",
  invoiceNumber: "INV-001",
  invoiceDate: "2026-10-01",
  dueDate: "2026-10-15",
  customerName: "PT Maju",
  name: "Pameran",
  customerPhone: "0812",
  location: "BSD",
  startDate: "2026-11-01T08:00:00",
  endDate: "2026-11-03T08:00:00",
  grandTotal: 1000,
  status: 1,
  paymentStatus: "Lunas",
  notes: "",
  remarks: "",
};

describe("InvoiceMobileCard", (): void => {
  it("should render invoice identity and payment status", (): void => {
    render(<InvoiceMobileCard invoice={invoice} onClick={jest.fn()} />);

    expect(screen.getByText("INV-001")).toBeTruthy();
    expect(screen.getByText("Pameran")).toBeTruthy();
    expect(screen.getByText("PT Maju")).toBeTruthy();
    expect(screen.getByText("Lunas").className).toContain("bg-success-subtle");
  });

  it("should call onClick with the invoice when clicked", (): void => {
    const onClick = jest.fn();

    render(<InvoiceMobileCard invoice={invoice} onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledWith(invoice);
  });
});
