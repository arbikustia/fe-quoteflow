import { render } from "@testing-library/react";

import { CalendarComponent } from "./Calendar.component";
import type { CalendarEventItem } from "./Calendar.type";

describe("CalendarComponent", () => {
  it("should show max 1 event label and a remaining more counter on mobile", (): void => {
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

    expect(mobileContainer?.querySelectorAll("button")).toHaveLength(1);
    expect(mobileContainer).toHaveTextContent("3 more...");
    expect(mobileContainer).not.toHaveTextContent("Event 2");
    expect(mobileContainer).not.toHaveTextContent("Event 3");
    expect(mobileContainer).not.toHaveTextContent("Event 4");
    expect(mobileContainer?.querySelector("button span.hidden.lg\\:inline")).toHaveTextContent("09:00");
  });

  it("should trigger onDateClick when a current month day cell is clicked", (): void => {
    const handleDateClick = jest.fn();
    const { container } = render(
      <CalendarComponent
        events={[]}
        currentDate={new Date(2026, 10, 2)}
        onDateClick={handleDateClick}
      />,
    );

    const clickableCell = container.querySelector('[role="button"]');
    expect(clickableCell).toBeInTheDocument();

    clickableCell?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(handleDateClick).toHaveBeenCalled();
  });
});
