import type { ApiRentalOrder } from "@/modules/report/Report.type";

import type { ApiChecklist, ChecklistRow } from "./ItemChecklist.type";
import { getChecklistRowKey, getChecklistRowNumber, getOrderCustomerName, mapChecklist } from "./ItemChecklist.util";

describe("ItemChecklist util", () => {
  it("should return empty string when order is undefined", () => {
    expect(getOrderCustomerName(undefined)).toBe("");
  });

  it("should return transaction customer_name when available", () => {
    const order = {
      invoice: {
        quotation: {
          transaction: { customer_name: "Test Customer" },
        },
      },
    } as ApiRentalOrder;
    expect(getOrderCustomerName(order)).toBe("Test Customer");
  });

  it("should return transaction customer.name when customer_name is missing", () => {
    const order = {
      invoice: {
        quotation: {
          transaction: { customer: { name: "Nested Customer" } },
        },
      },
    } as ApiRentalOrder;
    expect(getOrderCustomerName(order)).toBe("Nested Customer");
  });

  it("should return empty string when names are missing", () => {
    const order = {
      invoice: {
        quotation: {
          transaction: {},
        },
      },
    } as ApiRentalOrder;
    expect(getOrderCustomerName(order)).toBe("");
  });

  it("should map checklist status and counts", () => {
    const checklist = { id: "c1", checklist_no: "CHK-1", checklist_date: "2026-11-01", status: 2, order_id: "o1", items: [{}, {}] } as never as ApiChecklist;

    expect(mapChecklist(checklist, "PT A")).toEqual({ id: "c1", checklistNo: "CHK-1", customerName: "PT A", checklistDate: "2026-11-01", itemCount: 2, status: "active", orderId: "o1" });
    expect(mapChecklist({ ...checklist, status: 1 }, "").status).toBe("inactive");
    expect(mapChecklist({ ...checklist, status: null }, "").status).toBe("unavailable");
  });

  it("should compute row number and key", () => {
    expect(getChecklistRowNumber(2, 10, 0)).toBe(11);
    expect(getChecklistRowKey({ id: "c1" } as ChecklistRow)).toBe("c1");
  });
});
