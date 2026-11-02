import { render } from "@testing-library/react";

import { CalendarComponent } from "./Calendar.component";
import type { CalendarEventItem } from "./Calendar.type";

describe("CalendarComponent", () => {
  it("should show max 2 event labels and a remaining more counter on mobile", (): void => {
    const events: CalendarEventItem[] = [
      { id: "1", title: "Event 1", date: "2026-11-02", time: "09:00" },
      { id: "2", title: "Event 2", date: "2026-11-02" },
      { id: "3", title: "Event 3", date: "2026-11-02" },
      { id: "4", title: "Event 4", date: "2026-11-02" },
    ];

    const { container } = render(
      <CalendarComponent events={events} currentDate={new Date(2026, 10, 2)} />,
    );

    const mobileContainer = Array.from(container.querySelectorAll(".lg\\:hidden")).find((element) => element.textContent?.includes("Event 1"));

    expect(mobileContainer).toBeDefined();

    expect(mobileContainer?.querySelectorAll("button")).toHaveLength(2);
    expect(mobileContainer).toHaveTextContent("2 more...");
    expect(mobileContainer).not.toHaveTextContent("Event 3");
    expect(mobileContainer).not.toHaveTextContent("Event 4");
    expect(mobileContainer?.querySelector("button span.hidden.lg\\:inline")).toHaveTextContent("09:00");
  });
});
