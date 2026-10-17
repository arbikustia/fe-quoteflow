import { describe, expect, it } from "@jest/globals";

import { formatRupiahInput, parseRupiahInput } from "./MasterServiceTypeCreate.helpers";

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
});
