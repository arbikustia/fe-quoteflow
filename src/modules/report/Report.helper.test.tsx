import { MOCK_REPORT_ORDER } from "@/fixture/report";
import { fireEvent, render, screen } from "@/libs/unit-test";

import { OrderMobileCard } from "./Report.helper";

describe("OrderMobileCard", () => {
  it("should render event, customer, period and total", () => {
    render(<OrderMobileCard order={MOCK_REPORT_ORDER} onEditStatus={jest.fn()} />);

    const card = screen.getByRole("button");

    expect(card).toHaveTextContent("Resepsi12");
    expect(card).toHaveTextContent("Arbi");
    expect(card).toHaveTextContent("31 Oktober 2026 06:00 – 01 November 2026 06:00");
    expect(card).toHaveTextContent("active");
  });

  it("should call onEditStatus with the order when clicked", () => {
    const onEditStatus = jest.fn();

    render(<OrderMobileCard order={MOCK_REPORT_ORDER} onEditStatus={onEditStatus} />);
    fireEvent.click(screen.getByRole("button"));

    expect(onEditStatus).toHaveBeenCalledWith(MOCK_REPORT_ORDER);
  });
});
