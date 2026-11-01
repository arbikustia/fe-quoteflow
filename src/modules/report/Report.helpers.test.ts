import { getOrderRowNumber, toQuoteData } from "./Report.helpers";
import type { ReportOrderData } from "./Report.type";

describe("Report.helpers", () => {
  it("should calculate order row number correctly", () => {
    expect(getOrderRowNumber(1, 10, 0)).toBe(1);
    expect(getOrderRowNumber(2, 10, 4)).toBe(15);
  });

  it("should convert report order data to quote data", () => {
    const order: ReportOrderData = {
      id: "ord-1",
      orderNo: "ORDER-001",
      transactionId: "tx-1",
      invoiceNo: "INV-001",
      customerName: "Arbi",
      customerPhone: "08123",
      eventName: "Wedding",
      address: "Jakarta",
      orderDate: "2026-11-01",
      startDate: "2026-11-01",
      endDate: "2026-11-02",
      grandTotal: 500000,
      status: 1,
      statusLabel: "active",
      serviceTypeName: "REGULER",
      orderTypeName: "AMBIL",
    };

    const quote = toQuoteData(order);

    expect(quote.id).toBe("ord-1");
    expect(quote.name).toBe("Wedding");
    expect(quote.status).toBe(1);
  });
});
