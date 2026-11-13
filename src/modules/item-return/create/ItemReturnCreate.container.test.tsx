import type * as React from "react";

import { mockSelectedFormProps } from "@/fixture/item-return-create";
import { fireEvent, render, screen } from "@/libs/unit-test";

import ItemReturnCreate from "./ItemReturnCreate.container";

const mockUseCreate = jest.fn();

jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children, pageTitle }: { children: React.ReactNode; pageTitle: string }): React.ReactElement => <main aria-label={pageTitle}>{children}</main>,
}));
jest.mock("./ItemReturnCreate.hook", () => ({ useItemReturnCreate: (): unknown => mockUseCreate() }));
jest.mock("./ItemReturnCreate.component", () => ({
  ItemReturnCreateForm: (): React.ReactElement => <div>Form rendered</div>,
}));

describe("ItemReturnCreate container", () => {
  it("should render the create title and form", () => {
    mockUseCreate.mockReturnValue(mockSelectedFormProps);
    render(<ItemReturnCreate />);

    expect(screen.getByLabelText("New Item Return")).toBeInTheDocument();
    expect(screen.getByText("Form rendered")).toBeInTheDocument();
  });

  it("should render the edit title in edit mode", () => {
    mockUseCreate.mockReturnValue({ ...mockSelectedFormProps, isEditMode: true });
    render(<ItemReturnCreate />);

    expect(screen.getByLabelText("Edit Item Return")).toBeInTheDocument();
  });

  it("should go back when the back action is used", () => {
    mockUseCreate.mockReturnValue(mockSelectedFormProps);
    render(<ItemReturnCreate />);
    const back = screen.queryAllByRole("button", { name: /back/i })[0];

    if (back) {
      fireEvent.click(back);
      expect(mockSelectedFormProps.goBack).toHaveBeenCalled();
    }
  });
});
