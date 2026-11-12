import { MOCK_ORDER_TYPE_LIST_RESPONSE } from "@/fixture/master-order-type";

import { getOrderTypeRowNumber, normalizeOrderTypeList } from "./MasterOrderType.util";

describe("MasterOrderType util", () => {
  it("should return a loading view while the query is loading", () => {
    expect(normalizeOrderTypeList({ data: undefined, isLoading: true, isError: false })).toEqual({
      listStatus: "loading",
      orderTypes: [],
      totalPages: 0,
      totalCount: 0,
    });
  });

  it("should return error and missing views", () => {
    expect(normalizeOrderTypeList({ data: undefined, isLoading: false, isError: true }).listStatus).toBe("error");
    expect(normalizeOrderTypeList({ data: undefined, isLoading: false, isError: false }).listStatus).toBe("missing");
  });

  it("should return a missing view when a row does not match the schema", () => {
    const data = { ...MOCK_ORDER_TYPE_LIST_RESPONSE, data: [{ id: "x" }] } as never;

    expect(normalizeOrderTypeList({ data, isLoading: false, isError: false }).listStatus).toBe("missing");
  });

  it("should return an empty view when the page has no order types", () => {
    const data = { ...MOCK_ORDER_TYPE_LIST_RESPONSE, data: [], total_count: 0 };

    expect(normalizeOrderTypeList({ data, isLoading: false, isError: false }).listStatus).toBe("empty");
  });

  it("should normalize order types with handover flag, status and date", () => {
    const listView = normalizeOrderTypeList({ data: MOCK_ORDER_TYPE_LIST_RESPONSE, isLoading: false, isError: false });

    expect(listView.listStatus).toBe("ready");
    expect(listView.totalCount).toBe(2);
    expect(listView.orderTypes[0]).toEqual({
      id: "order-type-1",
      name: "Delivery",
      isHandover: "yes",
      status: "active",
      createdAt: "30 Oktober 2026 21:09",
    });
    expect(listView.orderTypes[1]).toEqual({ id: "order-type-2", name: "Pickup", isHandover: "no", status: "inactive", createdAt: "-" });
  });

  it("should number rows across pages", () => {
    expect(getOrderTypeRowNumber(1, 10, 0)).toBe(1);
    expect(getOrderTypeRowNumber(3, 20, 4)).toBe(45);
  });
});
