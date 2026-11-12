import type * as React from "react";

import { render, screen } from "@/libs/unit-test";

import InvoiceDetailContainer from "./InvoiceDetail.container";

jest.mock("./InvoiceDetail.hook", () => ({ useInvoiceDetail: (): Record<string, never> => ({}) }));
jest.mock("./InvoiceDetail.component", () => ({
  InvoiceDetailComponent: (): React.ReactElement => <div>Invoice detail</div>,
}));

describe("InvoiceDetailContainer", (): void => {
  it("should render the invoice detail component", (): void => {
    render(<InvoiceDetailContainer />);

    expect(screen.getByText("Invoice detail")).toBeTruthy();
  });
});
