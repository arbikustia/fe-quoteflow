import type { ApiRentalTransactionDetail } from "../Order.type";

import { buildEditForm } from "./helpers/OrderCreateForm.helpers";
import { calculateOrderTotals, getNextOrderStep, getPreviousOrderStep, hasSelectedOrderItem, isOrderInformationValid } from "./OrderCreate.helpers";

describe("OrderCreate step helpers", () => {
  it("should advance until pricing step", (): void => {
    expect(getNextOrderStep(1)).toBe(2);
    expect(getNextOrderStep(2)).toBe(3);
    expect(getNextOrderStep(3)).toBe(3);
  });

  it("should calculate subtotal for every event day before discount", (): void => {
    expect(calculateOrderTotals(
      [{ price: 250000, qty: 2 }, { price: 125000, qty: 1 }],
      8,
      25000,
      "2026-11-12T06:00",
      "2026-11-14T06:00"
    )).toEqual({
      subtotal: 1875000,
      discountAmount: 150000,
      grandTotal: 1750000,
    });
  });

  it("should calculate Project edit pricing from daily price", (): void => {
    expect(calculateOrderTotals(
      [{ item_id: "project-1", project_id: "project-1", price: 1000000, qty: 0, subtotal: 0 }],
      8,
      10000,
      "2026-11-13T06:00",
      "2026-11-15T06:00",
    )).toEqual({
      subtotal: 3000000,
      discountAmount: 240000,
      grandTotal: 2770000,
    });
  });

  it("should calculate one day when dates are unavailable", (): void => {
    expect(calculateOrderTotals([{ price: 100000, qty: 2 }], 10, 5000)).toEqual({
      subtotal: 200000,
      discountAmount: 20000,
      grandTotal: 185000,
    });
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
    expect(isOrderInformationValid({ ...information, start_at: "2026-11-08", end_at: "2026-11-01" })).toBe(false);
    expect(isOrderInformationValid({ ...information, start_at: "2026-11-08", end_at: "2026-11-08" })).toBe(true);
    expect(isOrderInformationValid({ ...information, start_at: "2026-11-08", end_at: "2026-11-09" })).toBe(true);
  });

  it("should require at least one selected item", (): void => {
    expect(hasSelectedOrderItem([{ item_id: "" }])).toBe(false);
    expect(hasSelectedOrderItem([{ item_id: "item-1" }])).toBe(true);
  });

  it("should hydrate Project daily price and remark without multiplying rental days", (): void => {
    const order: ApiRentalTransactionDetail = {
      id: "order-project",
      service_type_id: "service-project",
      service_type_name: "PROJECT",
      customer_name: "Customer",
      customer_phone: "0812",
      address: "Address",
      event_name: "Event",
      start_at: "2026-11-12 06:00:00",
      end_at: "2026-11-14 06:00:00",
      subtotal: 3000000,
      service_fee: 0,
      discount: 0,
      grand_total: 3000000,
      status: 1,
      created_at: "2026-11-01 00:00:00",
      updated_at: "2026-11-01 00:00:00",
      rental_transaction_items: [],
      rental_transaction_project: [{
        id: "project-1",
        name: "Lighting Package",
        remark: "Lighting setup",
        price: 1000000,
        qty: 1,
        subtotal: 3000000,
        items: [{ id: "project-item-1", item_id: "item-1", item_name: "Beam", qty: 1, price: 100000, remark: "" }],
      }],
    };

    const form = buildEditForm(order);

    expect(form.voucher_id).toBeNull();
    expect(form.rental_transaction_items[0]).toEqual(expect.objectContaining({
      item_id: "project-1",
      project_id: "project-1",
      price: 1000000,
      remark: "Lighting setup",
    }));
    expect(form.rental_transaction_items[1]).toEqual(expect.objectContaining({
      item_id: "item-1",
      price: 0,
      subtotal: 0,
      remark: "",
    }));
  });

  it("should use API remark as edit form default remarks", (): void => {
    const order: ApiRentalTransactionDetail = {
      id: "order-1",
      service_type_id: "service-1",
      service_type_name: "REGULER",
      customer_name: "Customer",
      customer_phone: "0812",
      address: "Address",
      event_name: "Event",
      start_at: "2026-11-12 06:00:00",
      end_at: "2026-11-14 06:00:00",
      subtotal: 100000,
      service_fee: 0,
      discount: 0,
      remark: "Prepare before event",
      grand_total: 100000,
      status: 1,
      created_at: "2026-11-01 00:00:00",
      updated_at: "2026-11-01 00:00:00",
      rental_transaction_items: [],
      rental_transaction_project: [],
    };

    expect(buildEditForm(order).remarks).toBe("Prepare before event");
  });
});
