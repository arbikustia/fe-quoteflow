import type * as React from "react";

import { render, screen } from "@/libs/unit-test";

import ItemChecklistContainer from "./ItemChecklist.container";

jest.mock("./ItemChecklist.hook", () => ({ useItemChecklistState: (): Record<string, never> => ({}) }));
jest.mock("./ItemChecklist.component", () => ({
  ItemChecklistComponent: (): React.ReactElement => <div>ItemChecklist rendered</div>,
}));

describe("ItemChecklistContainer", (): void => {
  it("should render the module component", (): void => {
    render(<ItemChecklistContainer />);

    expect(screen.getByText("ItemChecklist rendered")).not.toBeNull();
  });
});
