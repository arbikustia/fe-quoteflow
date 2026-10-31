import { formatRealtimeClock } from "./Navbar.helpers";

describe("formatRealtimeClock", () => {
  it("should format Indonesian long date and minute time", () => {
    const fixedDate = new Date(2026, 9, 17, 8, 5, 9);

    expect(formatRealtimeClock(fixedDate)).toBe("17 Oktober 2026 08:05");
  });

  it("should handle double-digit time values", () => {
    const fixedDate = new Date(2026, 11, 25, 23, 59, 58);

    expect(formatRealtimeClock(fixedDate)).toBe("25 Desember 2026 23:59");
  });
});
