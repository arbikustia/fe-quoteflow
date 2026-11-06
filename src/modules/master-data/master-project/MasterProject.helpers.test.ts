import { getProjectRowNumber } from "./MasterProject.helpers";

describe("getProjectRowNumber", (): void => {
  it("should calculate row number from page and row index", (): void => {
    expect(getProjectRowNumber(2, 10, 0)).toBe(11);
    expect(getProjectRowNumber(3, 5, 4)).toBe(15);
  });
});
