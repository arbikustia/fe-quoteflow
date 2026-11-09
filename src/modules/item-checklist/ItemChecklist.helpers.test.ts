import type { ApiRentalOrder } from "@/modules/report/Report.type";

import { getOrderCustomerName } from "./ItemChecklist.helpers";

describe("ItemChecklist.helpers", () => {
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
});
