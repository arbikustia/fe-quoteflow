import { describe, expect, it } from "@jest/globals";

import { validateMailValues } from "./MailCreate.helpers";

describe("validateMailValues", () => {
  it("should require every field", () => {
    const errors = validateMailValues({ senderId: "", to: "", subject: "", body: "" });

    expect(errors.senderError).toBeDefined();
    expect(errors.toError).toBeDefined();
    expect(errors.subjectError).toBeDefined();
    expect(errors.bodyError).toBeDefined();
  });

  it("should reject an invalid recipient address", () => {
    const errors = validateMailValues({ senderId: "s1", to: "not-an-email", subject: "Hi", body: "Body" });

    expect(errors.toError).toBe("Please enter a valid email address.");
  });

  it("should accept a complete payload", () => {
    const errors = validateMailValues({ senderId: "s1", to: "customer@example.com", subject: "Hi", body: "Body" });

    expect(Object.keys(errors)).toHaveLength(0);
  });
});
