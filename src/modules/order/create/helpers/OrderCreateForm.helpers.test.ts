import type { OrderItemPayload } from "../../Order.type";
import { updateSelectedItem } from "./OrderCreateForm.helpers";

const ROW: OrderItemPayload = {
  item_id: "",
  project_id: null,
  item_name: "",
  qty: 9,
  price: 0,
  subtotal: 0,
  remark: "",
};

describe("updateSelectedItem", (): void => {
  it("should clamp the row quantity to the selected item stock", (): void => {
    const row = updateSelectedItem(ROW, { id: "item-1", name: "Camera", image: null, price: 100000, stock: 4 });

    expect(row.qty).toBe(4);
    expect(row.subtotal).toBe(400000);
  });

  it("should keep the row quantity when stock is unknown", (): void => {
    const row = updateSelectedItem(ROW, { id: "item-1", name: "Camera", image: null, price: 100000, stock: null });

    expect(row.qty).toBe(9);
  });
});
