import type * as React from "react";

import test from "@/libs/unit-test";

import ItemChecklistDetailContainer from "./ItemChecklistDetail.container";

jest.mock("./ItemChecklistDetail.hook", () => ({ useItemChecklistDetail: (): Record<string, never> => ({}) }));
jest.mock("./ItemChecklistDetail.component", () => ({
  ItemChecklistDetailComponent: (): React.ReactElement => <div>ItemChecklistDetail rendered</div>,
}));

describe("ItemChecklistDetailContainer snapshot", () => {
  test.assertSnapshots(ItemChecklistDetailContainer, [{ props: {}, desc: "should render the module component" }]);
});
