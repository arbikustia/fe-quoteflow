import { fireEvent, render, screen } from "@/libs/unit-test";

import { renderMoveCheckbox } from "./ItemChecklistCreate.helper";
import type { ChecklistOrderItemRow } from "./ItemChecklistCreate.type";

const row = { id: "row-1", itemName: "Speaker" } as ChecklistOrderItemRow;

describe("ItemChecklistCreate helper", () => {
  it("should render a checked disabled move checkbox and stop click bubbling", () => {
    const onRowClick = jest.fn();

    render(<div onClick={onRowClick}>{renderMoveCheckbox({ row, checkedItemIds: ["row-1"], label: "Move out" })}</div>);
    const checkbox = screen.getByRole("checkbox", { name: "Move out Speaker" }) as HTMLInputElement;

    fireEvent.click(checkbox.parentElement as HTMLElement);

    expect(checkbox.checked).toBe(true);
    expect(checkbox.disabled).toBe(true);
    expect(onRowClick).not.toHaveBeenCalled();
  });
});
