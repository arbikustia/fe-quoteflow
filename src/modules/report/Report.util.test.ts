import { MOCK_REPORT_ORDER } from "@/fixture/report";

import { buildOrderUpdateRequest, getOrderCustomerLabel, getOrderEventTitle, getOrderRowNumber, getOrderStatusClass, getOrderStatusLabel, isOrderDone, sortReportOrders } from "./Report.util";

describe("Report.util", () => {
  it("should calculate order row number correctly", () => {
    expect(getOrderRowNumber(1, 10, 0)).toBe(1);
    expect(getOrderRowNumber(2, 10, 4)).toBe(15);
  });

  it("should sort report orders newest first without mutating the source", () => {
    const orders = [
      { ...MOCK_REPORT_ORDER, id: "1", orderNo: "ORDER-001", rawOrderDate: "2026-01-01" },
      { ...MOCK_REPORT_ORDER, id: "2", orderNo: "ORDER-002", rawOrderDate: "2026-03-01" },
    ];

    expect(sortReportOrders(orders).map((order) => order.orderNo)).toEqual(["ORDER-002", "ORDER-001"]);
    expect(orders.map((order) => order.orderNo)).toEqual(["ORDER-001", "ORDER-002"]);
  });

  it("should sort orders with the same date by order number descending", () => {
    const orders = [
      { ...MOCK_REPORT_ORDER, id: "1", orderNo: "ORDER-001" },
      { ...MOCK_REPORT_ORDER, id: "2", orderNo: "ORDER-002" },
    ];

    expect(sortReportOrders(orders).map((order) => order.orderNo)).toEqual(["ORDER-002", "ORDER-001"]);
  });

  it("should resolve status label and class from the order status", () => {
    const done = { ...MOCK_REPORT_ORDER, status: 2 };
    const inactive = { ...MOCK_REPORT_ORDER, status: 0, statusLabel: "inactive" as const };

    expect(isOrderDone(done)).toBe(true);
    expect(getOrderStatusLabel(done)).toBe("Done");
    expect(getOrderStatusLabel(MOCK_REPORT_ORDER)).toBe("active");
    expect(getOrderStatusClass(done)).toContain("success");
    expect(getOrderStatusClass(MOCK_REPORT_ORDER)).toContain("success");
    expect(getOrderStatusClass(inactive)).toContain("danger");
  });

  it("should fall back to order number and placeholder on the mobile card labels", () => {
    const empty = { ...MOCK_REPORT_ORDER, eventName: "", customerName: "" };

    expect(getOrderEventTitle(MOCK_REPORT_ORDER)).toBe("Resepsi12");
    expect(getOrderEventTitle(empty)).toBe("ORDER-001");
    expect(getOrderCustomerLabel(MOCK_REPORT_ORDER)).toBe("Arbi");
    expect(getOrderCustomerLabel(empty)).toBe("No customer name");
  });

  it("should build the update request with the new status", () => {
    expect(buildOrderUpdateRequest(MOCK_REPORT_ORDER, 2)).toEqual({
      id: "ord-1",
      transaction_id: "tx-1",
      invoice_id: "inv-1",
      quotation_id: "quo-1",
      order_no: "ORDER-001",
      order_date: "2026-11-01T01:32:01.000Z",
      notes: "Order note",
      status: 2,
    });
  });
});
