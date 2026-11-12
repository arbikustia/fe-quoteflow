import type * as React from "react";

import { render, screen } from "@/libs/unit-test";

import ItemChecklistDetailContainer from "./ItemChecklistDetail.container";

jest.mock("./ItemChecklistDetail.hook", () => ({ useItemChecklistDetail: (): Record<string, never> => ({}) }));
jest.mock("./ItemChecklistDetail.component", () => ({
  ItemChecklistDetailComponent: (): React.ReactElement => <div>ItemChecklistDetail rendered</div>,
}));

describe("ItemChecklistDetailContainer", (): void => {
  it("should render the module component", (): void => {
    render(<ItemChecklistDetailContainer />);

    expect(screen.getByText("ItemChecklistDetail rendered")).not.toBeNull();
  });
});
