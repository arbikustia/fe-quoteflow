import type * as React from "react";

import test from "@/libs/unit-test";

import InvoiceContainer from "./Invoice.container";

jest.mock("./Invoice.hook", () => ({
  useInvoicePagination: (): Record<string, never> => ({}),
  useInvoiceNavigation: (): Record<string, never> => ({}),
}));
jest.mock("./Invoice.component", () => ({
  InvoiceComponent: (): React.ReactElement => <div>Invoice list</div>,
}));
jest.mock("@/hooks/usePagePermission", () => ({
  usePagePermission: (): { canView: boolean } => ({ canView: true }),
}));

test.assertSnapshots(InvoiceContainer, [{ props: {}, desc: "should render the invoice list" }]);
