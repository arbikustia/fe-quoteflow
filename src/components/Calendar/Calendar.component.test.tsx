import { render } from "@/libs/unit-test";

import { CalendarComponent } from "./Calendar.component";
import type { CalendarEventItem } from "./Calendar.type";

describe("CalendarComponent", () => {
  it("should show max 3 event labels and a remaining counter on mobile", (): void => {
    const events: CalendarEventItem[] = [
      { id: "1", title: "Event 1", date: "2026-11-02", time: "09:00" },
      { id: "2", title: "Event 2", date: "2026-11-02" },
      { id: "3", title: "Event 3", date: "2026-11-02" },
      { id: "4", title: "Event 4", date: "2026-11-02" },
    ];

    const { container } = render(
      <CalendarComponent events={events} currentDate={new Date(2026, 10, 2)} />,
    );

    const mobileEventButtons = container.querySelectorAll(".absolute.z-10.block.lg\\:hidden button");

    expect(mobileEventButtons).toHaveLength(3);
    expect(mobileEventButtons[0]).toHaveTextContent("Event 1");
    expect(mobileEventButtons[1]).toHaveTextContent("Event 2");
    expect(mobileEventButtons[2]).toHaveTextContent("Event 3");
    expect(container).toHaveTextContent("+1 more");
    expect(Array.from(mobileEventButtons).some((button) => button.textContent?.includes("Event 4"))).toBe(false);
    expect(mobileEventButtons[0].querySelector("span.hidden.lg\\:inline")).toHaveTextContent("09:00");
  });

  it("should connect a mobile multi-day event across date columns", (): void => {
    const events: CalendarEventItem[] = [
      { id: "multi-day", title: "Three day event", date: "2026-11-02", endDate: "2026-11-04" },
    ];

    const { container } = render(
      <CalendarComponent events={events} currentDate={new Date(2026, 10, 2)} />,
    );

    const mobileEventBars = container.querySelectorAll(".absolute.z-10.block.lg\\:hidden");

    expect(mobileEventBars).toHaveLength(1);
    expect(mobileEventBars[0]).toHaveTextContent("Three day event");
    expect(mobileEventBars[0].getAttribute("style")).toContain("42.8571%");
  });

  it("should connect one multi-day event label and show more event count on dashboard", (): void => {
    const events: CalendarEventItem[] = [
      { id: "1", title: "Event 1", date: "2026-11-02", endDate: "2026-11-04", time: "09:00" },
      { id: "2", title: "Event 2", date: "2026-11-02" },
      { id: "3", title: "Event 3", date: "2026-11-02" },
      { id: "4", title: "Event 4", date: "2026-11-02" },
    ];

    const { container } = render(
      <CalendarComponent events={events} currentDate={new Date(2026, 10, 2)} showControls={false} />,
    );

    const dashboardEventBars = container.querySelectorAll(".absolute.z-10.hidden.lg\\:block");

    expect(dashboardEventBars).toHaveLength(1);
    expect(dashboardEventBars[0]).toHaveTextContent("Event 1");
    expect(dashboardEventBars[0].getAttribute("style")).toContain("42.8571%");
    expect(container).toHaveTextContent("+3 more events");
    expect(container).not.toHaveTextContent("Event 2");
    expect(container).not.toHaveTextContent("Event 3");
    expect(container).not.toHaveTextContent("Event 4");
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
