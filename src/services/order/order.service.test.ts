import { mapOrder } from "./order.service";

describe("mapOrder", () => {
  it("should map an order when rental items are unavailable", () => {
    const order = mapOrder({
      id: "order-1",
      customer_name: "Customer",
      customer_phone: "08123456789",
      address: "Jakarta",
      event_name: "Event",
      start_at: "2026-10-27T00:00:00.000Z",
      end_at: "2026-10-28T00:00:00.000Z",
      grand_total: 100000,
      status: 1,
      created_at: "2026-10-27T00:00:00.000Z",
    });

    expect(order.selectedItems).toEqual([]);
    expect(order.qty).toBe(0);
  });
});
