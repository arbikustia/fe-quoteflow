import { fireEvent, render, screen } from "@/libs/unit-test";

import { ChecklistStatusBadge, ItemChecklistMobileCard } from "./ItemChecklist.helper";
import type { ChecklistRow } from "./ItemChecklist.type";

const row: ChecklistRow = { id: "chk-1", checklistNo: "CHK-1", customerName: "", checklistDate: "2026-11-01T08:00:00", itemCount: 3, status: "unavailable", orderId: "ord-1" };

describe("ItemChecklist helper", () => {
  it("should render status label", () => {
    render(<ChecklistStatusBadge status="active" />);

    expect(screen.getByText("Done")).not.toBeNull();
  });

  it("should render mobile card fallback and open row", () => {
    const onClick = jest.fn();

    render(<ItemChecklistMobileCard row={row} onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("No customer name")).not.toBeNull();
    expect(screen.getByText("Pending")).not.toBeNull();
    expect(onClick).toHaveBeenCalledWith(row);
  });
});
