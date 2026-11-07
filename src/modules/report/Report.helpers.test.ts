import type { ReportOrderData } from "./Report.type";

import { getOrderRowNumber, sortReportOrders } from "./Report.helpers";

describe("Report.helpers", () => {
  it("should calculate order row number correctly", () => {
    expect(getOrderRowNumber(1, 10, 0)).toBe(1);
    expect(getOrderRowNumber(2, 10, 4)).toBe(15);
  });

  it("should sort report orders newest first without mutating the source", () => {
    const orders: ReportOrderData[] = [
      { id: "1", orderNo: "ORDER-001", transactionId: "tx-1", invoiceId: "inv-1", quotationId: "quo-1", invoiceNo: "INV-001", notes: "", rawOrderDate: "2026-01-01", customerName: "", customerPhone: "", eventName: "", address: "", orderDate: "2026-01-01", startDate: "", endDate: "", grandTotal: 0, status: 1, statusLabel: "active", serviceTypeName: "", orderTypeName: "" },
      { id: "2", orderNo: "ORDER-002", transactionId: "tx-2", invoiceId: "inv-2", quotationId: "quo-2", invoiceNo: "INV-002", notes: "", rawOrderDate: "2026-03-01", customerName: "", customerPhone: "", eventName: "", address: "", orderDate: "2026-03-01", startDate: "", endDate: "", grandTotal: 0, status: 1, statusLabel: "active", serviceTypeName: "", orderTypeName: "" },
    ];

    expect(sortReportOrders(orders).map((order) => order.orderNo)).toEqual(["ORDER-002", "ORDER-001"]);
    expect(orders.map((order) => order.orderNo)).toEqual(["ORDER-001", "ORDER-002"]);
  });
});
