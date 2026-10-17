import { formatRealtimeClock } from "./Navbar.helpers";

describe("formatRealtimeClock", () => {
  it("formats date to DD-MM-YYYY HH:mm:ss with leading zero padding", () => {
    const fixedDate = new Date(2026, 9, 17, 8, 5, 9); // October 17, 2026 08:05:09
    expect(formatRealtimeClock(fixedDate)).toBe("17-10-2026 08:05:09");
  });

  it("handles double-digit values properly", () => {
    const fixedDate = new Date(2026, 11, 25, 23, 59, 58); // December 25, 2026 23:59:58
    expect(formatRealtimeClock(fixedDate)).toBe("25-12-2026 23:59:58");
  });
});
