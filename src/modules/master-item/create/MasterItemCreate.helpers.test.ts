import { describe, expect, it } from "@jest/globals";

import { formatRupiahInput, parseRupiahInput, validateRequiredItemFields } from "./MasterItemCreate.helpers";

describe("MasterItemCreate helpers", () => {
  it("should parse formatted Rupiah string to plain digits", () => {
    expect(parseRupiahInput("Rp 1.500.000")).toBe("1500000");
    expect(parseRupiahInput("abc1200xyz")).toBe("1200");
    expect(parseRupiahInput("")).toBe("");
  });

  it("should format plain digits to Rupiah currency display", () => {
    expect(formatRupiahInput("1500000")).toBe("Rp 1.500.000");
    expect(formatRupiahInput("20000")).toBe("Rp 20.000");
    expect(formatRupiahInput("")).toBe("");
  });

  describe("validateRequiredItemFields", () => {
    const validFields = {
      name: "Speaker",
      categoryId: "cat-1",
      price: "100000",
      stock: "5",
      duration: "2",
    };

    it("should return null when all required fields are present", () => {
      expect(validateRequiredItemFields(validFields)).toBeNull();
    });

    it("should validate missing name", () => {
      expect(validateRequiredItemFields({ ...validFields, name: "   " })).toBe("Item name is required.");
    });

    it("should validate missing category", () => {
      expect(validateRequiredItemFields({ ...validFields, categoryId: "" })).toBe("Category is required.");
    });

    it("should validate missing price", () => {
      expect(validateRequiredItemFields({ ...validFields, price: "" })).toBe("Price is required.");
    });

    it("should validate missing stock", () => {
      expect(validateRequiredItemFields({ ...validFields, stock: "" })).toBe("Stock is required.");
    });

    it("should validate missing duration", () => {
      expect(validateRequiredItemFields({ ...validFields, duration: "" })).toBe("Duration is required.");
    });
  });
});
