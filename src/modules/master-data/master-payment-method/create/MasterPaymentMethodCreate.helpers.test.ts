import { describe, expect, it } from "@jest/globals";

import { validatePaymentMethodFields } from "./MasterPaymentMethodCreate.helpers";

describe("validatePaymentMethodFields", () => {
  it("should return null when all fields are filled", () => {
    expect(validatePaymentMethodFields("Credit Card", "Payment via credit card")).toBeNull();
  });

  it("should return error when name is empty", () => {
    expect(validatePaymentMethodFields("   ", "Valid description")).toBe(
      "Payment method name is required.",
    );
  });

  it("should return error when description is empty", () => {
    expect(validatePaymentMethodFields("Credit Card", "   ")).toBe(
      "Description is required.",
    );
  });
});
