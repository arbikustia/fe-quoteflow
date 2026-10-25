import { describe, expect, it } from "@jest/globals";

import { getQuotationRowNumber } from "./Quotation.helpers";

describe("Quotation helpers", () => {
  it("calculates 1-based index across pages", () => {
    expect(getQuotationRowNumber(1, 10, 0)).toBe(1);
    expect(getQuotationRowNumber(1, 10, 4)).toBe(5);
    expect(getQuotationRowNumber(2, 10, 0)).toBe(11);
    expect(getQuotationRowNumber(3, 20, 2)).toBe(43);
  });
});
