import type * as React from "react";

import test from "@/libs/unit-test";

import ItemReturnContainer from "./ItemReturn.container";

jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: (): { canView: boolean } => ({ canView: true }) }));
jest.mock("./ItemReturn.hook", () => ({ useItemReturnState: (): Record<string, never> => ({}) }));
jest.mock("./ItemReturn.component", () => ({
  ItemReturnComponent: (): React.ReactElement => <div>ItemReturn rendered</div>,
}));

describe("ItemReturnContainer snapshot", () => {
  test.assertSnapshots(ItemReturnContainer, [{ props: {}, desc: "should render the module component" }]);
});
