import type * as React from "react";

import test from "@/libs/unit-test";

import InvoiceDetailContainer from "./InvoiceDetail.container";

jest.mock("./InvoiceDetail.hook", () => ({ useInvoiceDetail: (): Record<string, never> => ({}) }));
jest.mock("./InvoiceDetail.component", () => ({
  InvoiceDetailComponent: (): React.ReactElement => <div>Invoice detail</div>,
}));

test.assertSnapshots(InvoiceDetailContainer, [{ props: {}, desc: "should render the invoice detail" }]);
