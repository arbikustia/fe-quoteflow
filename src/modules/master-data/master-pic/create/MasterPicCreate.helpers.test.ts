import { describe, expect, it } from "@jest/globals";

import { validatePicFields } from "./MasterPicCreate.helpers";

describe("validatePicFields", () => {
  it("should return null when PIC name is provided", () => {
    expect(validatePicFields("John Doe")).toBeNull();
  });

  it("should return error message when PIC name is empty", () => {
    expect(validatePicFields("   ")).toBe("PIC name is required.");
  });
});
