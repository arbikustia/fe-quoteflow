import type * as React from "react";

import { mockSelectedFormProps } from "@/fixture/item-return-create";
import test from "@/libs/unit-test";

import ItemReturnCreate from "./ItemReturnCreate.container";

jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }): React.ReactElement => <main>{children}</main>,
}));
jest.mock("./ItemReturnCreate.hook", () => ({ useItemReturnCreate: (): unknown => mockSelectedFormProps }));
jest.mock("./ItemReturnCreate.component", () => ({
  ItemReturnCreateForm: (): React.ReactElement => <div>Form rendered</div>,
}));

describe("ItemReturnCreate container snapshot", () => {
  test.assertSnapshots(ItemReturnCreate, [{ props: {}, desc: "should render the page layout around the form" }]);
});
