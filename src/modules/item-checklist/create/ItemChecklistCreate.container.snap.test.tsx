import type * as React from "react";

import test from "@/libs/unit-test";

import ItemChecklistCreateContainer from "./ItemChecklistCreate.container";

const mockIsEditMode = false;

jest.mock("./ItemChecklistCreate.hook", () => ({ useItemChecklistCreate: (): { isEditMode: boolean; goBack: () => void } => ({ isEditMode: mockIsEditMode, goBack: jest.fn() }) }));
jest.mock("./ItemChecklistCreate.component", () => ({
  ItemChecklistCreateForm: (): React.ReactElement => <div>ItemChecklistCreate rendered</div>,
}));
jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }): React.ReactElement => <div>{children}</div>,
}));
jest.mock("@/app/shared/PageLayout", () => ({
  PageLayout: ({ children, title }: { children: React.ReactNode; title: string }): React.ReactElement => <section><h1>{title}</h1>{children}</section>,
}));

describe("ItemChecklistCreateContainer snapshot", () => {
  test.assertSnapshots(ItemChecklistCreateContainer, [{ props: {}, desc: "should render the module component" }]);
});
