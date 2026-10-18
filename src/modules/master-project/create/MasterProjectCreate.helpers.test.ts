import type { ApiItem } from "@/modules/master-item/MasterItem.type";
import type { ProjectItemOption, ProjectItemSelection } from "@/modules/master-project/MasterProject.type";
import type { useGetAllItemsQuery } from "@/services/master-item.service";

import {
  formatProjectMessages,
  mapProjectItemOptions,
  mapProjectSelectedItems,
  toggleSelectedItem,
  updateSelectedQuantity,
  validateProjectStep,
} from "./MasterProjectCreate.helpers";

describe("MasterProjectCreate.helpers", () => {
  describe("formatProjectMessages", () => {
    it("should join array messages with a space", () => {
      expect(formatProjectMessages(["Name exists.", "Invalid stock."])).toBe("Name exists. Invalid stock.");
    });

    it("should return string message directly", () => {
      expect(formatProjectMessages("Custom error")).toBe("Custom error");
    });

    it("should return fallback message when messages is null", () => {
      expect(formatProjectMessages(null)).toBe("Project request failed.");
    });
  });

  describe("mapProjectItemOptions", () => {
    it("should map valid item response data", () => {
      const response: ReturnType<typeof useGetAllItemsQuery>["data"] = {
        status: true,
        messages: null,
        data: [
          {
            id: "item-1",
            name: "Camera",
            image: "camera.jpg",
            price: 50000,
            stock: 10,
          } as ApiItem,
        ],
      };

      const result = mapProjectItemOptions(response);
      expect(result).toEqual([
        {
          id: "item-1",
          name: "Camera",
          image: "camera.jpg",
          price: 50000,
          stock: 10,
        },
      ]);
    });

    it("should return empty array when response status is falsy", () => {
      expect(mapProjectItemOptions(undefined)).toEqual([]);
    });
  });

  describe("toggleSelectedItem", () => {
    const itemOption: ProjectItemOption = {
      id: "item-1",
      name: "Lens",
      image: "",
      price: 1000,
      stock: 5,
    };

    it("should add item with qty 1 when not present", () => {
      const result = toggleSelectedItem([], itemOption);
      expect(result).toEqual([{ ...itemOption, qty: 1 }]);
    });

    it("should remove item when already present", () => {
      const current: ProjectItemSelection[] = [{ ...itemOption, qty: 3 }];
      const result = toggleSelectedItem(current, itemOption);
      expect(result).toEqual([]);
    });
  });

  describe("updateSelectedQuantity", () => {
    const current: ProjectItemSelection[] = [
      { id: "item-1", name: "Tripod", image: "", price: 200, stock: 5, qty: 1 },
    ];

    it("should clamp quantity within 1 and stock ceiling", () => {
      const lower = updateSelectedQuantity(current, "item-1", 0);
      expect(lower[0].qty).toBe(1);

      const upper = updateSelectedQuantity(current, "item-1", 10);
      expect(upper[0].qty).toBe(5);
    });

    it("should ignore unmatched item ids", () => {
      const result = updateSelectedQuantity(current, "item-999", 3);
      expect(result).toEqual(current);
    });
  });

  describe("validateProjectStep", () => {
    it("should return error on step 1 without items", () => {
      expect(validateProjectStep(1, 0, "Any")).toBe("Select at least one item.");
      expect(validateProjectStep(1, 1, "Any")).toBeNull();
    });

    it("should return error on step 2 without project name", () => {
      expect(validateProjectStep(2, 1, "  ")).toBe("Project name is required.");
      expect(validateProjectStep(2, 1, "My Project")).toBeNull();
    });

    it("should return null on step 3", () => {
      expect(validateProjectStep(3, 1, "My Project")).toBeNull();
    });
  });

  describe("mapProjectSelectedItems", () => {
    const itemOptions: ProjectItemOption[] = [
      { id: "i-1", name: "Camera", image: "", price: 100, stock: 4 },
    ];

    it("should return empty array if project or items empty", () => {
      expect(mapProjectSelectedItems(null, itemOptions)).toEqual([]);
      expect(mapProjectSelectedItems({ items: [] }, [])).toEqual([]);
    });

    it("should map project items to selection with clamped quantity", () => {
      const result = mapProjectSelectedItems(
        { items: [{ item_id: "i-1", qty: 99 }] },
        itemOptions,
      );

      expect(result).toEqual([
        { id: "i-1", name: "Camera", image: "", price: 100, stock: 4, qty: 4 },
      ]);
    });
  });
});
