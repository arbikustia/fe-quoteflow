import { mockOrderItems } from "@/fixture/item-return-create";
import type { ApiRentalOrder } from "@/modules/report/Report.type";

import type { ReturnSaveInput } from "./ItemReturnCreate.type";
import {
  applyItemOverrides,
  buildReturnPayload,
  buildSubmitPayload,
  filterReturnItems,
  firstOrFallback,
  formatReturnDate,
  getActivityName,
  getOrderItems,
  getOrderOptions,
  getQtyUnit,
  getReturnSaveError,
  getSaveErrorMessage,
  getSaveValidationError,
  getThrownMessage,
  removeAt,
} from "./ItemReturnCreate.util";

const validInput = { isEditMode: false, hasId: false, hasReturnData: false, hasSelectedOrder: true, isUploading: false, hasPreview: false, itemCount: 1 };

const mockOrder = {
  id: "order-1",
  order_no: "ORD-001",
  invoice: { quotation: { transaction: {
    customer_name: "Customer A",
    rental_transaction_items: [{ item_id: "item-1", item_name: "Speaker", qty: 2 }],
    rental_transaction_project: [{ items: [{ item_id: "item-2", item_name: "Mic", qty: 1 }] }],
  } } },
} as unknown as ApiRentalOrder;

describe("ItemReturnCreate util", () => {
  it("should build order options labelled with customer and order number", () => {
    expect(getOrderOptions([mockOrder])).toEqual([{ value: "order-1", label: "Customer A — ORD-001" }]);
  });

  it("should pick singular or plural unit", () => {
    expect(getQtyUnit(1)).toBe("unit");
    expect(getQtyUnit(2)).toBe("units");
  });

  it("should prefer the list, then the single value, then empty", () => {
    expect(firstOrFallback(["a"], "b")).toEqual(["a"]);
    expect(firstOrFallback([], "b")).toEqual(["b"]);
    expect(firstOrFallback()).toEqual([]);
  });

  it("should map standard and project order items into rows", () => {
    const rows = getOrderItems(mockOrder, new Map([["item-1", "Audio"]]));

    expect(rows.map((row) => row.id)).toEqual(["item-1-0", "item-2-proj-0-0"]);
    expect(rows[0]).toMatchObject({ category: "Audio", unit: "units", condition: "Good" });
    expect(rows[1].category).toBe("-");
    expect(getOrderItems(undefined, new Map())).toEqual([]);
  });

  it("should apply condition, notes and photo overrides", () => {
    const rows = applyItemOverrides(mockOrderItems, { "itm-1-0": { condition: "Broken", notes: "Cracked" } }, new Map([["itm-1-0", { fileUrls: ["u"], fileNames: ["n"] }]]));

    expect(rows[0]).toMatchObject({ condition: "Broken", notes: "Cracked", fileUrls: ["u"], fileNames: ["n"] });
    expect(rows[1]).toEqual(mockOrderItems[1]);
  });

  it("should filter rows by search term", () => {
    expect(filterReturnItems(mockOrderItems, "  ")).toBe(mockOrderItems);
    expect(filterReturnItems(mockOrderItems, "speaker")).toHaveLength(1);
    expect(filterReturnItems(mockOrderItems, "zzz")).toHaveLength(0);
  });

  it("should format the return date at noon", () => {
    expect(formatReturnDate(new Date(2026, 10, 3))).toBe("11-03-2026 12:00:00");
  });

  it("should build a payload with only selected rows and existing item ids", () => {
    const payload = buildReturnPayload({
      orderId: "order-1", returnDate: "2026-11-03T00:00:00", returnNotes: "n", status: 1,
      rows: [{ ...mockOrderItems[0], fileUrls: ["u1"], fileNames: ["n1"] }, mockOrderItems[1]],
      returnItemIds: ["itm-1-0"], isEditMode: true,
      existingItems: [{ item_id: "itm-1", return_id: "r1", status: 1 } as never],
    });

    expect(payload.items).toHaveLength(1);
    expect(payload.items[0]).toMatchObject({ return_id: "r1", file_url: "u1", status: 1, images: [{ file_url: "u1", file_name: "n1" }] });
  });

  it("should return the first failing validation message", () => {
    expect(getSaveValidationError({ ...validInput, isEditMode: true })).toBe("Unable to load item return.");
    expect(getSaveValidationError({ ...validInput, hasSelectedOrder: false })).toBe("Please select a rental order first.");
    expect(getSaveValidationError({ ...validInput, isUploading: true })).toBe("Wait for photo upload to finish.");
    expect(getSaveValidationError({ ...validInput, hasPreview: true })).toBe("Confirm or discard photo before saving.");
    expect(getSaveValidationError({ ...validInput, itemCount: 0 })).toBe("No items available to return for this order.");
    expect(getSaveValidationError(validInput)).toBeNull();
  });

  it("should read mutation error messages", () => {
    expect(getSaveErrorMessage({ status: 400, data: ["a", "b"] })).toBe("a b");
    expect(getSaveErrorMessage({ status: 400, data: "bad" })).toBe("bad");
    expect(getSaveErrorMessage({ message: "boom" })).toBe("boom");
    expect(getSaveErrorMessage({})).toBe("Unable to save item return.");
  });

  it("should read thrown messages with a fallback", () => {
    expect(getThrownMessage(new Error("x"), "f")).toBe("x");
    expect(getThrownMessage("str", "f")).toBe("f");
  });

  it("should remove the item at an index", () => {
    expect(removeAt(["a", "b", "c"], 1)).toEqual(["a", "c"]);
  });
});

describe("ItemReturnCreate save input helpers", () => {
  const input = {
    id: "r1",
    source: { isEditMode: true, returnData: { id: "r1", order_id: "order-9", status: 2, items: [] }, selectedOrder: undefined, returnItemIds: ["itm-1-0"] },
    fields: { selectedOrderId: "order-1", returnDate: "", returnNotes: "note" },
    photos: { guards: { upload: { current: false } }, view: { photoPreview: null } },
  } as unknown as ReturnSaveInput;

  it("should build the submit payload from the loaded return in edit mode", () => {
    const payload = buildSubmitPayload(input, mockOrderItems);

    expect(payload).toMatchObject({ order_id: "order-9", status: 2, notes: "note" });
    expect(payload.items).toHaveLength(1);
  });

  it("should validate through the save input", () => {
    expect(getReturnSaveError(input)).toBeNull();
  });

  it("should name the activity after the return, order or id", () => {
    expect(getActivityName(input)).toBe("r1");
    expect(getActivityName({ ...input, source: { ...input.source, returnData: null } } as unknown as ReturnSaveInput)).toBe("r1");
    expect(getActivityName({ id: undefined, source: { returnData: null, selectedOrder: undefined } } as unknown as ReturnSaveInput)).toBe("Item Return");
  });
});
