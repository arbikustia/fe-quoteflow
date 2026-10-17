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
      categoryId: null,
      categoryName: null,
      price: 0,
      stock: 0,
      image: null,
      duration: 0,
      remark: null,
      status: "active",
      createAt: null,
      createBy: null,
    });
  });

  it("should map non-active status to inactive", () => {
    expect(_mapItem({ ...apiItem, status: 0 }).status).toBe("inactive");
  });
});
