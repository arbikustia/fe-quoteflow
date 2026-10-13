import { _mapItem } from "./MasterItem.api";
import type { ApiItem } from "./MasterItem.type";

const apiItem: ApiItem = {
  id: "item-1",
  name: "Speaker",
  category: null,
  price: null,
  stock: null,
  image: null,
  duration: null,
  remark: null,
  unit: null,
  status: 1,
  created_at: null,
  created_by: null,
};

describe("MasterItem API", () => {
  it("should map API item fields to UI item fields", () => {
    expect(_mapItem(apiItem)).toEqual({
      id: "item-1",
      name: "Speaker",
      category: "",
      price: 0,
      stock: 0,
      image: "",
      duration: "",
      remark: "",
      unit: "",
      status: "active",
      createAt: "",
      createBy: "",
    });
  });

  it("should map non-active status to inactive", () => {
    expect(_mapItem({ ...apiItem, status: 0 }).status).toBe("inactive");
  });
});
