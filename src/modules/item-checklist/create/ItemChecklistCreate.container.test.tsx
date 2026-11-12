import type * as React from "react";

import { render, screen } from "@/libs/unit-test";

import ItemChecklistCreateContainer from "./ItemChecklistCreate.container";

let mockIsEditMode = false;

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

describe("ItemChecklistCreateContainer", (): void => {
  it("should render the module component", (): void => {
    render(<ItemChecklistCreateContainer />);

    expect(screen.getByText("ItemChecklistCreate rendered")).not.toBeNull();
  });

  it("should show the edit title in edit mode", (): void => {
    mockIsEditMode = true;
    render(<ItemChecklistCreateContainer />);

    expect(screen.getByText("Edit Item Checklist")).not.toBeNull();
    mockIsEditMode = false;
  });
});
