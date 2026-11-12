import type * as React from "react";

import { render, screen } from "@/libs/unit-test";

import InvoiceStatusContainer from "./InvoiceStatus.container";

jest.mock("./InvoiceStatus.hook", () => ({ useInvoiceStatusForm: (): Record<string, never> => ({}) }));
jest.mock("./InvoiceStatus.component", () => ({
  InvoiceStatusForm: (): React.ReactElement => <div>Status form</div>,
}));
jest.mock("@/app/layout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }): React.ReactElement => <div>{children}</div>,
}));

describe("InvoiceStatusContainer", (): void => {
  it("should render the status form inside the layout", (): void => {
    render(<InvoiceStatusContainer />);

    expect(screen.getByText("Status form")).toBeTruthy();
  });
});
