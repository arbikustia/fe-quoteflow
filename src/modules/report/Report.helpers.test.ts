import { getOrderRowNumber } from "./Report.helpers";

describe("Report.helpers", () => {
  it("should calculate order row number correctly", () => {
    expect(getOrderRowNumber(1, 10, 0)).toBe(1);
    expect(getOrderRowNumber(2, 10, 4)).toBe(15);
  });
});
