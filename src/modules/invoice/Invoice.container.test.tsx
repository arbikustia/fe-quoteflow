import type * as React from "react";

import { render, screen } from "@/libs/unit-test";

import InvoiceContainer from "./Invoice.container";

import { usePagePermission } from "@/hooks/usePagePermission";

jest.mock("./Invoice.hook", () => ({
  useInvoicePagination: (): Record<string, never> => ({}),
  useInvoiceNavigation: (): Record<string, never> => ({}),
}));
jest.mock("./Invoice.component", () => ({
  InvoiceComponent: (): React.ReactElement => <div>Invoice list</div>,
}));
jest.mock("@/hooks/usePagePermission", () => ({ usePagePermission: jest.fn() }));

describe("InvoiceContainer", (): void => {
  it("should render the list with view permission", (): void => {
    jest.mocked(usePagePermission).mockReturnValue({ canView: true } as never);
    render(<InvoiceContainer />);

    expect(screen.getByText("Invoice list")).toBeTruthy();
  });

  it("should render nothing without view permission", (): void => {
    jest.mocked(usePagePermission).mockReturnValue({ canView: false } as never);
    render(<InvoiceContainer />);

    expect(screen.queryByText("Invoice list")).toBeNull();
  });
});
