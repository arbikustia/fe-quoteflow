import type * as React from "react";

import { render, screen } from "@/libs/unit-test";

import ItemReturnContainer from "./ItemReturn.container";

const mockPermission = jest.fn();

jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: (): { canView: boolean } => mockPermission() as { canView: boolean } }));
jest.mock("./ItemReturn.hook", () => ({ useItemReturnState: (): Record<string, never> => ({}) }));
jest.mock("./ItemReturn.component", () => ({
  ItemReturnComponent: (): React.ReactElement => <div>ItemReturn rendered</div>,
}));

describe("ItemReturnContainer", (): void => {
  it("should render the module component when view is allowed", (): void => {
    mockPermission.mockReturnValue({ canView: true });
    render(<ItemReturnContainer />);

    expect(screen.getByText("ItemReturn rendered")).not.toBeNull();
  });

  it("should render nothing when view is denied", (): void => {
    mockPermission.mockReturnValue({ canView: false });
    render(<ItemReturnContainer />);

    expect(screen.queryByText("ItemReturn rendered")).toBeNull();
  });
});
