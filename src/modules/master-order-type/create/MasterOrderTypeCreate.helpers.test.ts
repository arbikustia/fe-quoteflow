import { formatOrderTypeName } from "./MasterOrderTypeCreate.helpers";

describe("MasterOrderTypeCreate helpers", () => {
  it("should trim leading whitespace from input", () => {
    expect(formatOrderTypeName("   Rental")).toBe("Rental");
    expect(formatOrderTypeName("Project")).toBe("Project");
  });
});
