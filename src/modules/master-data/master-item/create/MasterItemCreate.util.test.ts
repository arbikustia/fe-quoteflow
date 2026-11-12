import { MOCK_API_ITEMS } from "@/fixture/master-item";

import type { ItemFormValues } from "./MasterItemCreate.type";
import {
  buildImageFormData,
  buildItemPayload,
  createTextChangeHandlers,
  formatApiMessages,
  formatRupiahInput,
  getImageFileName,
  getItemFieldErrors,
  normalizeItemFormSource,
  resolveItemForm,
  sanitizeItemInput,
  sendItemMutation,
  toCategoryOptions,
} from "./MasterItemCreate.util";

const VALID_VALUES: ItemFormValues = {
  name: "Beam 290",
  categoryId: "category-1",
  price: "100000",
  stock: "11",
  duration: "1",
  image: "https://cdn.example.com/beam.jpg",
  remark: "Lighting",
  isActive: false,
};

const EXPECTED_PAYLOAD = {
  name: "Beam 290",
  category_id: "category-1",
  price: 100000,
  stock: 11,
  image: "https://cdn.example.com/beam.jpg",
  duration: 1,
  remark: "Lighting",
  status: 0,
};

describe("MasterItemCreate util", () => {
  it("should format backend messages", () => {
    expect(formatApiMessages(["Duplicate", "item"])).toBe("Duplicate item");
    expect(formatApiMessages("Server error")).toBe("Server error");
    expect(formatApiMessages(null)).toBe("Item request failed.");
  });

  it("should return a ready empty form in create mode", () => {
    expect(normalizeItemFormSource({})).toEqual({ formStatus: "ready", initialValues: expect.objectContaining({ name: "", isActive: true }) });
  });

  it("should return an error state without a matching item in router state", () => {
    expect(normalizeItemFormSource({ id: "item-1" }).formStatus).toBe("error");
    expect(normalizeItemFormSource({ id: "item-9", routeItem: MOCK_API_ITEMS[0] }).formStatus).toBe("error");
  });

  it("should map the router state item into form values", () => {
    expect(normalizeItemFormSource({ id: "item-1", routeItem: MOCK_API_ITEMS[0] }).initialValues).toEqual({
      name: "Beam 290",
      categoryId: "category-1",
      price: "100000",
      stock: "11",
      duration: "1",
      image: "https://cdn.example.com/api/image/beam-290.jpg",
      remark: "Lighting",
      isActive: true,
    });
    expect(normalizeItemFormSource({ id: "item-2", routeItem: MOCK_API_ITEMS[1] }).initialValues).toEqual({
      name: "Wireless Mic",
      categoryId: "",
      price: "",
      stock: "",
      duration: "",
      image: "",
      remark: "",
      isActive: false,
    });
  });

  it("should validate required fields", () => {
    expect(resolveItemForm(VALID_VALUES)).toEqual({ values: VALID_VALUES, errors: {} });
    expect(getItemFieldErrors(resolveItemForm({ ...VALID_VALUES, name: " ", categoryId: "", price: "", stock: "", duration: "" }).errors)).toEqual({
      name: "Item name is required.",
      categoryId: "Category is required.",
      price: "Price is required.",
      stock: "Stock is required.",
      duration: "Duration is required.",
    });
  });

  it("should keep only digits in numeric fields", () => {
    expect(sanitizeItemInput("price", "Rp 1.500")).toBe("1500");
    expect(sanitizeItemInput("stock", "12a")).toBe("12");
    expect(sanitizeItemInput("name", "Mic 2")).toBe("Mic 2");
  });

  it("should create one sanitizing handler per text field", () => {
    const onFieldChange = jest.fn();
    const handlers = createTextChangeHandlers(onFieldChange);

    handlers.price({ target: { value: "Rp 2.000" } } as never);
    handlers.name({ target: { value: "Mic" } } as never);

    expect(Object.keys(handlers)).toEqual(["name", "price", "stock", "duration"]);
    expect(onFieldChange.mock.calls).toEqual([["price", "2000"], ["name", "Mic"]]);
  });

  it("should format price input, image names, upload bodies and category options", () => {
    const file = new File(["x"], "beam.jpg");

    expect(formatRupiahInput("")).toBe("");
    expect(formatRupiahInput("100000")).toBe("Rp 100.000");
    expect(getImageFileName("https://cdn.example.com/a/beam.jpg")).toBe("beam.jpg");
    expect(buildImageFormData(file).get("file")).toBe(file);
    expect(toCategoryOptions([{ id: "c-1", category_name: "Audio" }])).toEqual([{ label: "Audio", value: "c-1" }]);
  });

  it("should build the payload and send update with the id, otherwise create", async () => {
    const response = { status: true, data: null, messages: null };
    const createItem = jest.fn(() => ({ unwrap: (): Promise<typeof response> => Promise.resolve(response) }));
    const updateItem = jest.fn(() => ({ unwrap: (): Promise<typeof response> => Promise.resolve(response) }));

    expect(buildItemPayload({ ...VALID_VALUES, isActive: true }).status).toBe(1);

    await sendItemMutation(VALID_VALUES, { createItem, updateItem });
    await sendItemMutation(VALID_VALUES, { id: "item-1", createItem, updateItem });

    expect(createItem).toHaveBeenCalledWith(EXPECTED_PAYLOAD);
    expect(updateItem).toHaveBeenCalledWith({ ...EXPECTED_PAYLOAD, id: "item-1" });
  });
});
