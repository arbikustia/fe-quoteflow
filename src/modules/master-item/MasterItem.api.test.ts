import { _mapItem } from "./MasterItem.api";
import type { ApiItem } from "./MasterItem.type";

const apiItem: ApiItem = {
  id: "item-1",
  name: "Speaker",
  category_id: null,
  price: null,
  stock: null,
  image: null,
  duration: null,
  remark: null,
  status: 1,
  created_at: null,
  created_by: null,
};

describe("MasterItem API", () => {
  it("should map API item fields to UI item fields", () => {
    expect(_mapItem(apiItem)).toEqual({
      id: "item-1",
      name: "Speaker",
      categoryId: "",
      price: 0,
      stock: 0,
      image: "",
      duration: 0,
      remark: "",
      status: "active",
      createAt: "",
      createBy: "",
    });
  });

  it("should map non-active status to inactive", () => {
    expect(_mapItem({ ...apiItem, status: 0 }).status).toBe("inactive");
  });
});
