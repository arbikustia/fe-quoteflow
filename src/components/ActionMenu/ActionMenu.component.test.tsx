import { describe, expect, it } from "@jest/globals";
import { fireEvent, render, screen } from "@/libs/unit-test";

import { ActionMenu } from "./ActionMenu.component";

describe("ActionMenu", () => {
  it("should close when clicking outside", (): void => {
    render(
      <div>
        <ActionMenu testId="actions" icon={<span>...</span>}>
          <button type="button" role="menuitem">Edit</button>
        </ActionMenu>
        <button type="button">Outside</button>
      </div>,
    );
    const trigger = screen.getByTestId("actions");
    const details = trigger.closest("details");

    fireEvent.click(trigger);
    expect(details?.hasAttribute("open")).toBe(true);
    fireEvent.mouseDown(screen.getByRole("button", { name: "Outside" }));
    expect(details?.hasAttribute("open")).toBe(false);
  });

  it("should close when pressing Escape", (): void => {
    render(
      <ActionMenu testId="actions" icon={<span>...</span>}>
        <button type="button" role="menuitem">Edit</button>
      </ActionMenu>,
    );
    const trigger = screen.getByTestId("actions");
    const details = trigger.closest("details");

    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(details?.hasAttribute("open")).toBe(false);
  });
});
