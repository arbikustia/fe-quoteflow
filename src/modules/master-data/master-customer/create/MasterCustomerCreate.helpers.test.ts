import { describe, expect, it } from "@jest/globals";

import { parsePhoneInput } from "./MasterCustomerCreate.helpers";

describe("MasterCustomerCreate helpers", () => {
  it("should keep only digits from phone input", () => {
    expect(parsePhoneInput("081234567890")).toBe("081234567890");
    expect(parsePhoneInput("6281234567890")).toBe("6281234567890");
    expect(parsePhoneInput("1212345678")).toBe("1212345678");
    expect(parsePhoneInput("+62 812-3456-7890")).toBe("6281234567890");
    expect(parsePhoneInput("phone: 0812abc")).toBe("0812");
    expect(parsePhoneInput("")).toBe("");
  });
});
