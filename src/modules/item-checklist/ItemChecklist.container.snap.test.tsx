import type * as React from "react";

import test from "@/libs/unit-test";

import ItemChecklistContainer from "./ItemChecklist.container";

jest.mock("./ItemChecklist.hook", () => ({ useItemChecklistState: (): Record<string, never> => ({}) }));
jest.mock("./ItemChecklist.component", () => ({
  ItemChecklistComponent: (): React.ReactElement => <div>ItemChecklist rendered</div>,
}));

describe("ItemChecklistContainer snapshot", () => {
  test.assertSnapshots(ItemChecklistContainer, [{ props: {}, desc: "should render the module component" }]);
});
