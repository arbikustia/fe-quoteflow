import { describe, expect, it } from "@jest/globals";

import {
  formatRupiahInput,
  formatServiceTypeMessages,
  parseRupiahInput,
  resolveServiceTypeStatus,
} from "./MasterServiceTypeCreate.helpers";

describe("MasterServiceTypeCreate helpers", () => {
  it("formats numeric price as Rupiah", () => {
    expect(formatRupiahInput("500000")).toBe("Rp 500.000");
    expect(formatRupiahInput("1500000")).toBe("Rp 1.500.000");
    expect(formatRupiahInput("")).toBe("");
  });

  it("keeps only numeric price digits", () => {
    expect(parseRupiahInput("Rp 500.000")).toBe("500000");
    expect(parseRupiahInput("abc12x3")).toBe("123");
  });

  it("formats backend messages into a string", () => {
    expect(formatServiceTypeMessages(["Error 1", "Error 2"])).toBe("Error 1 Error 2");
    expect(formatServiceTypeMessages("Single error")).toBe("Single error");
    expect(formatServiceTypeMessages(null)).toBe("Failed to save service type.");
  });

  it("resolves status code properly", () => {
    expect(resolveServiceTypeStatus(false, false)).toBe(1);
    expect(resolveServiceTypeStatus(true, true)).toBe(1);
    expect(resolveServiceTypeStatus(true, false)).toBe(0);
  });
});
