import { formatActivityDateTime, getActionBadgeClass, getActivityLogRowKey } from "./ActivityLog.util";

describe("ActivityLog.util", () => {
  it("should format activity date and time", () => {
    expect(formatActivityDateTime("2026-11-01T07:00:00.000Z")).toContain("2026");
  });

  it("should return raw value for invalid date", () => {
    expect(formatActivityDateTime("not-a-date")).toBe("not-a-date");
  });

  it("should return activity id as row key", () => {
    expect(getActivityLogRowKey({ id: "a1", userName: "", action: "", page: "", description: "", createdAt: "" })).toBe("a1");
  });

  it.each([
    ["create", "success"],
    ["update", "warning"],
    ["delete", "danger"],
    ["view", "information"],
    ["other", "information"],
  ])("should resolve %s action badge class", (action: string, expected: string) => {
    expect(getActionBadgeClass(action)).toContain(expected);
  });
});
