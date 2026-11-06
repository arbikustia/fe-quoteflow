import { describe, expect, it } from "@jest/globals";

import { validatePaymentTypeFields } from "./MasterPaymentTypeCreate.helpers";

describe("validatePaymentTypeFields", () => {
  it("should accept a filled payment type name", () => {
    expect(validatePaymentTypeFields("Full Payment")).toBeNull();
  });

  it("should reject an empty payment type name", () => {
    expect(validatePaymentTypeFields("   ")).toBe("Payment type name is required.");
  });
});

