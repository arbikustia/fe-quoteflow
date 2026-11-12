import { resolveOrderDetailError } from "./OrderDetail.util";

describe("resolveOrderDetailError", (): void => {
  it("should return the failure message when the query failed", (): void => {
    expect(resolveOrderDetailError(true, true)).toBe("Unable to load order detail.");
  });

  it("should return the unavailable message when the status is false", (): void => {
    expect(resolveOrderDetailError(false, false)).toBe("Order detail is unavailable.");
  });

  it("should return null when the query succeeded or has no status yet", (): void => {
    expect(resolveOrderDetailError(false, true)).toBeNull();
    expect(resolveOrderDetailError(false)).toBeNull();
  });
});
