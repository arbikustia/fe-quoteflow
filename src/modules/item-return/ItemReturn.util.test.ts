import { createEditClickHandler, getReturnRemark, getReturnRowKey, getReturnRowNumber, mapReturn } from "./ItemReturn.util";
import type { ApiReturn, ReturnRow } from "./ItemReturn.type";

const row: ReturnRow = { id: "r-1", customerName: "A", returnDate: "2026-11-01T08:00:00", itemCount: 1, notes: "-", status: "active" };

describe("mapReturn", () => {
  it("should map active return correctly", () => {
    const item: ApiReturn = {
      id: "return-1",
      order_id: "order-123",
      return_date: "2026-11-03T10:00:00.000Z",
      notes: "Good condition",
      status: 1,
      created_at: "2026-11-03T10:00:00.000Z",
      updated_at: "2026-11-03T10:00:00.000Z",
      items: [
        {
          id: "item-1",
          return_id: "return-1",
          item_id: "inv-1",
          customer_name: "Customer Name",
          qty: 2,
          condition: "good",
          notes: "",
          file_url: "",
          file_name: "",
          status: 1,
          created_at: "2026-11-03T10:00:00.000Z",
          updated_at: "2026-11-03T10:00:00.000Z",
        },
      ],
    };

    const mapped = mapReturn(item);

    expect(mapped.id).toBe("return-1");
    expect(mapped.customerName).toBe("Customer Name");
    expect(mapped.itemCount).toBe(1);
    expect(mapped.status).toBe("active");
    expect(mapped.notes).toBe("Good condition");
  });

  it("should map inactive and null status", () => {
    const itemInactive: ApiReturn = {
      id: "return-2",
      order_id: "order-456",
      return_date: "2026-11-03T10:00:00.000Z",
      notes: "",
      status: 0,
      created_at: "",
      updated_at: "",
      items: [],
    };

    expect(mapReturn(itemInactive).status).toBe("inactive");
    expect(mapReturn(itemInactive).notes).toBe("-");

    const itemNull: ApiReturn = {
      ...itemInactive,
      status: null,
    };

    expect(mapReturn(itemNull).status).toBe("unavailable");
  });
});

describe("ItemReturn util", () => {
  it("should return row key and row number", () => {
    expect(getReturnRowKey(row)).toBe("r-1");
    expect(getReturnRowNumber(2, 10, 0)).toBe(11);
  });

  it("should return placeholder remark when notes are empty", () => {
    expect(getReturnRemark(row)).toBe("No remark");
    expect(getReturnRemark({ ...row, notes: "Ok" })).toBe("Ok");
  });

  it("should stop propagation and call edit", () => {
    const onEdit = jest.fn();
    const stopPropagation = jest.fn();

    createEditClickHandler(row, onEdit)({ stopPropagation } as never);

    expect(stopPropagation).toHaveBeenCalled();
    expect(onEdit).toHaveBeenCalledWith(row);
  });
});
