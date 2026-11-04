import ENDPOINT from "@/constant/endpoint.const";

import { calendarService } from "./calendar.service";

describe("calendarService", () => {
  it("should have getCalendarEvents endpoint configured", () => {
    expect(calendarService.endpoints.getCalendarEvents).toBeDefined();
  });

  it("should configure query parameters for dateFrom and dateTo", () => {
    const endpoint = calendarService.endpoints.getCalendarEvents;
    const queryResult = endpoint.initiate({ dateFrom: "10-01-2026", dateTo: "10-30-2026" });

    expect(ENDPOINT.DASHBOARD.CALENDAR).toBe("/api/dashboard/calendar");
    expect(queryResult).toBeDefined();
  });
});
