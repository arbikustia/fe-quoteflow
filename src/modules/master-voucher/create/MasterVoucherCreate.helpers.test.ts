import { describe, expect, it } from "@jest/globals";

import { generateSecureVoucherCode, validateTypedVoucherCode } from "./MasterVoucherCreate.helpers";

describe("voucher code helpers", () => {
  it("generates an 8-character code with SL prefix", () => {
    const code = generateSecureVoucherCode();

    expect(code).toMatch(/^SL[A-Z0-9]{6}$/);
  });

  it("validates typed code length and characters", () => {
    expect(validateTypedVoucherCode("SLGHT857")).toBeNull();
    expect(validateTypedVoucherCode("abc1234")).toBeNull();
    expect(validateTypedVoucherCode("ABC123")).toBe("Voucher code must be 7 to 8 alphanumeric characters.");
    expect(validateTypedVoucherCode("ABC12345!"))
      .toBe("Voucher code must be 7 to 8 alphanumeric characters.");
  });
});
