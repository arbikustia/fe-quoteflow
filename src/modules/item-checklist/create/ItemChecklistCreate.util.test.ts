import type { ApiChecklist } from "../ItemChecklist.type";

import { getChecklistData, getChecklistItems, getOrderItems, getOrderItemsEmptyText, getOrderItemRowKey, getOrderOptions, ignoreManualChange, stopClickPropagation } from "./ItemChecklistCreate.util";

import type { ApiRentalOrder } from "@/modules/report/Report.type";

const order = {
  id: "order-1",
  order_no: "ORD-1",
  invoice: { quotation: { transaction: {
    customer_name: "PT A",
    pic: { name: "Budi" },
    rental_transaction_items: [{ item_id: "item-1", item_name: "Speaker", qty: 1 }],
    rental_transaction_project: [{ items: [{ item_id: "item-2", item_name: "Mic", category_name: "Audio", qty: 2 }] }],
  } } },
} as never as ApiRentalOrder;

const checklist = {
  id: "chk-1",
  order_id: "order-1",
  items: [{ id: "entry-1", item_id: "item-1", item_name: "", description: "Speaker desc", qty: 2, sign: "Ani" }],
} as never as ApiChecklist;

describe("ItemChecklistCreate util", () => {
  it("should map orders to select options", () => {
    expect(getOrderOptions([order])[0].value).toBe("order-1");
  });

  it("should map order transaction and project items", () => {
    const rows = getOrderItems(order);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual(expect.objectContaining({ id: "item-1-0", category: "-", unit: "unit", sign: "Budi" }));
    expect(rows[1]).toEqual(expect.objectContaining({ id: "item-2-proj-0-0", category: "Audio", unit: "units" }));
    expect(getOrderItems()).toEqual([]);
  });

  it("should map checklist items with category lookup", () => {
    const rows = getChecklistItems(checklist, new Map([["item-1", "Audio"]]));

    expect(rows[0]).toEqual(expect.objectContaining({ itemName: "Speaker desc", category: "Audio", unit: "units" }));
  });

  it("should resolve create and edit data", () => {
    const createData = getChecklistData({ isEditMode: false, selectedOrderId: "order-1", ordersData: [order], ordersStatus: true });
    const editData = getChecklistData({ isEditMode: true, selectedOrderId: "", detailData: checklist, ordersStatus: false, itemsData: [{ id: "item-1", category_name: "Audio" }, { id: "item-9" }], itemsStatus: true });

    expect(createData.orderOptions).toHaveLength(1);
    expect(createData.orderItems).toHaveLength(2);
    expect(editData.orderOptions).toEqual([]);
    expect(editData.orderItems[0].category).toBe("Audio");
  });

  it("should expose row helpers", () => {
    const stopPropagation = jest.fn();

    stopClickPropagation({ stopPropagation } as never);

    expect(stopPropagation).toHaveBeenCalled();
    expect(ignoreManualChange()).toBeUndefined();
    expect(getOrderItemRowKey({ id: "row-1" } as never)).toBe("row-1");
    expect(getOrderItemsEmptyText("x")).toBe("No items matching search.");
    expect(getOrderItemsEmptyText("")).toBe("No items found for this order.");
  });
});
