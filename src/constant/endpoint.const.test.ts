import ENDPOINT from "./endpoint.const";

describe("Rental checklist detail endpoint", () => {
  it("should request rental checklist detail from the confirmed endpoint", () => {
    expect(ENDPOINT.RENTAL_CHECKLIST.DETAIL).toBe("/api/rental-checklist");
  });
});
