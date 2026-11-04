import {
  formatCalendarQueryDate,
  getCalendarMonthRange,
  mapCalendarItemToEvent,
  mapQuotationToCalendarEvent,
} from "./Calendar.helpers";
import type { ApiCalendarItem } from "./Calendar.type";

describe("Calendar.helpers", () => {
  describe("formatCalendarQueryDate", () => {
    it("should format date as MM-DD-YYYY", () => {
      const date = new Date(2026, 9, 1);

      expect(formatCalendarQueryDate(date)).toBe("10-01-2026");
    });

    it("should format double digit day and single digit month correctly", () => {
      const date = new Date(2026, 0, 15);

      expect(formatCalendarQueryDate(date)).toBe("01-15-2026");
    });
  });

  describe("getCalendarMonthRange", () => {
    it("should return start and end of month formatted in MM-DD-YYYY", () => {
      const date = new Date(2026, 9, 15);
      const range = getCalendarMonthRange(date);

      expect(range.dateFrom).toBe("10-01-2026");
      expect(range.dateTo).toBe("10-31-2026");
    });
  });

  describe("mapCalendarItemToEvent", () => {
    it("should map API calendar item correctly", () => {
      const item: ApiCalendarItem = {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        transaction_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        order_no: "ORD-001",
        title: "Pesta Nikah",
        customer_name: "Budi",
        event_name: "Wedding",
        address: "Jl. Merdeka",
        start: "2026-11-03T09:49:04.348Z",
        end: "2026-11-05T09:49:04.348Z",
        total_amount: 5000000,
        status: 2,
      };

      const event = mapCalendarItemToEvent(item);

      expect(event.id).toBe("3fa85f64-5717-4562-b3fc-2c963f66afa6");
      expect(event.title).toBe("Pesta Nikah");
      expect(event.date).toBe("2026-11-03");
      expect(event.endDate).toBe("2026-11-05");
      expect(event.customerName).toBe("Budi");
      expect(event.quotationNo).toBe("ORD-001");
      expect(event.amount).toBe(5000000);
      expect(event.variant).toBe("green");
    });

    it("should fallback to event_name or order_no when title is empty", () => {
      const item: ApiCalendarItem = {
        id: "id-1",
        transaction_id: "tx-1",
        order_no: "ORD-002",
        title: "",
        customer_name: "Siti",
        event_name: "Birthday Party",
        address: "",
        start: "2026-11-10T00:00:00.000Z",
        end: "",
        total_amount: 1000000,
        status: 0,
      };

      const event = mapCalendarItemToEvent(item);

      expect(event.title).toBe("Birthday Party");
      expect(event.endDate).toBeUndefined();
      expect(event.variant).toBe("neutral");
    });
  });

  describe("mapQuotationToCalendarEvent", () => {
    it("should map quotation transaction to calendar event", () => {
      const quotation = {
        id: "q-1",
        quotation_no: "Q-001",
        status: 1,
        transaction: {
          event_name: "Concert",
          start_at: "2026-12-01T10:00:00.000Z",
          end_at: "2026-12-02T10:00:00.000Z",
          customer_name: "Musician",
          grand_total: 2000000,
        },
      };

      // @ts-expect-error partial mock for testing
      const event = mapQuotationToCalendarEvent(quotation);

      expect(event.id).toBe("q-1");
      expect(event.title).toBe("Concert");
      expect(event.variant).toBe("blue");
    });
  });
});
