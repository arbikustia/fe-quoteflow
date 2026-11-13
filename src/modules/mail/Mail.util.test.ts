import { formatMailDisplayValue, getMailRowNumber } from "./Mail.util";

describe("Mail util", () => {
  it("should show a dash for empty display values", () => {
    expect(formatMailDisplayValue("")).toBe("—");
    expect(formatMailDisplayValue("a@b.com")).toBe("a@b.com");
  });

  it("should number rows across pages", () => {
    expect(getMailRowNumber(1, 10, 0)).toBe(1);
    expect(getMailRowNumber(3, 10, 4)).toBe(25);
  });
});
