import { fireEvent, render, screen } from "@/libs/unit-test";

import { QuotationMobileCard } from "./Quotation.helper";
import type { QuotationData } from "./Quotation.type";

const QUOTATION: QuotationData = {
  id: "q1",
  transactionId: "t1",
  quotationNumber: "QUO-001",
  customerName: "PT Example",
  name: "Gala",
  quotationDate: "2026-10-01T08:00:00",
  customerPhone: "0812",
  location: "Jakarta",
  startDate: "2026-11-01T08:00:00",
  endDate: "2026-11-02T08:00:00",
  grandTotal: 1500000,
  status: 2,
};

describe("QuotationMobileCard", (): void => {
  it("should render quotation details and report clicks", (): void => {
    const onClick = jest.fn();

    render(<QuotationMobileCard quotation={QUOTATION} onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("Approved")).toBeTruthy();
    expect(screen.getByText("Rp 1.500.000")).toBeTruthy();
    expect(onClick).toHaveBeenCalledWith(QUOTATION);
  });
});
