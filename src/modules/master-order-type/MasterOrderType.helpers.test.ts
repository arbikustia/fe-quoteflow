import { getOrderTypeRowNumber } from "./MasterOrderType.helpers";

describe("getOrderTypeRowNumber", (): void => {
  it("should calculate row number from page and row index", (): void => {
    expect(getOrderTypeRowNumber(1, 10, 0)).toBe(1);
    expect(getOrderTypeRowNumber(2, 10, 0)).toBe(11);
    expect(getOrderTypeRowNumber(3, 5, 4)).toBe(15);
  });
});
