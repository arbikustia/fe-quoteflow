import { calculateOrderTotals, getNextOrderStep, getPreviousOrderStep, hasSelectedOrderItem, isOrderInformationValid } from "./OrderCreate.helpers";

describe("OrderCreate step helpers", () => {
  it("should advance until pricing step", (): void => {
    expect(getNextOrderStep(1)).toBe(2);
    expect(getNextOrderStep(2)).toBe(3);
    expect(getNextOrderStep(3)).toBe(3);
  });

  it("should calculate subtotal and grand total", (): void => {
    expect(calculateOrderTotals([{ price: 10000, qty: 2 }, { price: 5000, qty: 1 }], 3000, 2000)).toEqual({ subtotal: 25000, grandTotal: 24000 });
  });

  it("should return until order information step", (): void => {
    expect(getPreviousOrderStep(3)).toBe(2);
    expect(getPreviousOrderStep(2)).toBe(1);
    expect(getPreviousOrderStep(1)).toBe(1);
  });

  it("should require every order information field except optional fields", (): void => {
    const information = { customer_id: "customer", customer_name: "Customer", customer_phone: "0812", pic_id: "pic", service_type_id: "service", order_type_id: "order-type", handover_type: "", handover_name: "", service_fee: 0, event_name: "Event", start_at: "2026-10-25", end_at: "2026-10-26" };

    expect(isOrderInformationValid(information)).toBe(true);
    expect(isOrderInformationValid({ ...information, order_type_id: "" })).toBe(false);
    expect(isOrderInformationValid({ ...information, event_name: "" })).toBe(false);
    expect(isOrderInformationValid(information, true)).toBe(false);
    expect(isOrderInformationValid({ ...information, handover_type: "KTP", handover_name: "Owner" }, true)).toBe(true);
  });

  it("should require at least one selected item", (): void => {
    expect(hasSelectedOrderItem([{ item_id: "" }])).toBe(false);
    expect(hasSelectedOrderItem([{ item_id: "item-1" }])).toBe(true);
  });
});
