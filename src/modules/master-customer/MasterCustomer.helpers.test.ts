import { getCustomerRowNumber } from "./MasterCustomer.helpers";

describe("getCustomerRowNumber", (): void => {
  it("should calculate row number from page and row index", (): void => {
    expect(getCustomerRowNumber(2, 10, 0)).toBe(11);
    expect(getCustomerRowNumber(3, 5, 4)).toBe(15);
  });
});
