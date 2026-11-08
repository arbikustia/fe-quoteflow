import { formatActivityDateTime, getActionBadgeClass } from "./ActivityLog.helpers";

describe("ActivityLog helpers", () => {
  it("should format activity date and time", () => {
    expect(formatActivityDateTime("2026-11-01T07:00:00.000Z")).toContain("2026");
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
